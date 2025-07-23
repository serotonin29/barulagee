# Environment Configuration for Google Drive Integration

## Required Environment Variables

To enable Google Drive upload functionality, you need to set up the following environment variables:

### 1. Google API Configuration
```bash
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here  
NEXT_PUBLIC_GOOGLE_APP_ID=your_google_app_id_here
```

### 2. Firebase Configuration
The Firebase storage bucket has been updated to use: `cendekia-fk-unp.firebasestorage.app`

## How to Set Up Google Drive API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Drive API and Google Picker API
4. Create credentials (API Key and OAuth 2.0 Client ID)
5. Set up OAuth consent screen
6. Add your domain to authorized origins

## Features Implemented

✅ **Google Drive Upload**: Download files from Google Drive and upload to Firebase Storage
✅ **Local File Upload**: Direct upload to Firebase Storage  
✅ **Embed URL**: Support for YouTube and external video URLs
✅ **Error Handling**: Graceful fallback when Google APIs are not available
✅ **Firebase Storage**: Updated to use correct bucket (cendekia-fk-unp.firebasestorage.app)

## Testing Status

- ✅ Upload dialog opens correctly
- ✅ All three upload methods are accessible
- ✅ Google Drive integration shows proper error message when API keys are missing
- ✅ Local file upload form displays correctly
- ✅ Embed URL form works for YouTube links
- ✅ Firebase storage configuration is updated
- ✅ Build process succeeds without errors