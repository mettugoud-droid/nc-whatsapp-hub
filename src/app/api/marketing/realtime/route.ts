import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/marketing/realtime
 * 
 * Fetches real-time data from GA4 Data API
 * Requires: GA4 Property ID + Service Account credentials
 * 
 * GA4 Realtime API: POST https://analyticsdata.googleapis.com/v1beta/properties/{propertyId}:runRealtimeReport
 */
export async function GET() {
  try {
    // Get stored credentials
    const settings = await prisma.setting.findMany({ where: { category: "marketing" } });
    const getVal = (key: string) => settings.find(s => s.key === key)?.value || "";

    const ga4PropertyId = getVal("marketing_ga4PropertyId") || "538202474";
    const serviceAccountJson = getVal("marketing_ga4ServiceAccount");

    if (!ga4PropertyId) {
      return NextResponse.json({
        success: false,
        error: "GA4 Property ID not configured",
        setup: {
          step1: "Go to Google Analytics → Admin → Property Settings → Copy Property ID (numeric)",
          step2: "Go to Google Cloud Console → Create Service Account → Download JSON key",
          step3: "In GA4 Admin → Property Access → Add the service account email as Viewer",
          step4: "Save the service account JSON in Settings page",
        },
      }, { status: 400 });
    }

    if (!serviceAccountJson) {
      // Try using the Measurement Protocol API secret for basic data
      // The Measurement Protocol is write-only, so we need the Data API
      return NextResponse.json({
        success: false,
        error: "GA4 Service Account not configured",
        message: "To fetch real-time data, you need to create a Google Cloud service account and grant it Viewer access to your GA4 property.",
        instructions: [
          "1. Go to https://console.cloud.google.com",
          "2. Create a project (or use existing)",
          "3. Enable 'Google Analytics Data API'",
          "4. Create Service Account → Download JSON key",
          "5. In GA4 → Admin → Property Access → Add service account email as 'Viewer'",
          "6. Paste the JSON key content in Settings → Marketing → Service Account field",
        ],
        ga4PropertyId,
      }, { status: 400 });
    }

    // Parse service account and get access token
    let serviceAccount: any;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid service account JSON" }, { status: 400 });
    }

    // Generate JWT and exchange for access token
    const accessToken = await getGoogleAccessToken(serviceAccount);
    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Failed to authenticate with Google" }, { status: 401 });
    }

    // Fetch realtime report from GA4
    const realtimeData = await fetchGA4Realtime(ga4PropertyId, accessToken);

    return NextResponse.json({ success: true, data: realtimeData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * Get Google OAuth2 access token from service account
 */
async function getGoogleAccessToken(serviceAccount: any): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: serviceAccount.client_email,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    // Create JWT (simplified - in production use jose or google-auth-library)
    const { SignJWT, importPKCS8 } = await import("jose");
    const privateKey = await importPKCS8(serviceAccount.private_key, "RS256");
    const jwt = await new SignJWT(payload as any)
      .setProtectedHeader(header)
      .sign(privateKey);

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const tokenData = await tokenRes.json();
    return tokenData.access_token || null;
  } catch {
    return null;
  }
}

/**
 * Fetch GA4 Realtime Report
 */
async function fetchGA4Realtime(propertyId: string, accessToken: string) {
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      metrics: [
        { name: "activeUsers" },
        { name: "screenPageViews" },
        { name: "eventCount" },
        { name: "conversions" },
      ],
      dimensions: [
        { name: "unifiedScreenName" },
      ],
      limit: 10,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `GA4 API error: ${res.status}`);
  }

  const data = await res.json();

  // Parse response
  const totals = data.totals?.[0]?.metricValues || [];
  const rows = data.rows || [];

  return {
    activeUsers: parseInt(totals[0]?.value || "0"),
    pageViews: parseInt(totals[1]?.value || "0"),
    events: parseInt(totals[2]?.value || "0"),
    conversions: parseInt(totals[3]?.value || "0"),
    topPages: rows.map((row: any) => ({
      page: row.dimensionValues?.[0]?.value || "Unknown",
      users: parseInt(row.metricValues?.[0]?.value || "0"),
    })),
    fetchedAt: new Date().toISOString(),
  };
}
