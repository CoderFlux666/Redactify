# Redactify - Deployment Checklist

## Pre-Deployment

- [x] Document history working
- [x] Audio redaction working  
- [x] Video redaction working
- [x] Authentication working
- [x] Database connected
- [x] UI polished

## Backend (Hugging Face Spaces)

- [ ] Create HF Space
- [ ] Configure environment variables
- [ ] Push code to HF Space
- [ ] Test backend endpoint
- [ ] Note down HF Space URL

## Frontend (Vercel)

- [ ] Push to GitHub
- [ ] Import project to Vercel
- [ ] Configure environment variables
- [ ] Update NEXT_PUBLIC_API_URL to HF Space URL
- [ ] Deploy
- [ ] Test deployment

## Post-Deployment

- [ ] Update CORS in backend/main.py with actual Vercel domain
- [ ] Test all features end-to-end
- [ ] Verify document uploads
- [ ] Verify authentication flow
- [ ] Check database persistence
