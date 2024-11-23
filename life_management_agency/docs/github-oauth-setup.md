# Setting up GitHub OAuth for Life Management Agency

Follow these steps to create a GitHub OAuth application and get the required credentials:

1. Go to GitHub.com and sign in to your account
2. Navigate to Settings > Developer settings > OAuth Apps
3. Click "New OAuth App"
4. Fill in the application details:
   - Application name: Life Management Agency
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
   - Description: (optional) Life Management Agency authentication

5. Click "Register application"
6. You'll see your new OAuth app's settings. Note down:
   - Client ID (shown immediately)
   - Click "Generate a new client secret" and copy the secret immediately (it won't be shown again)

These credentials will be used in the .env file:
- GITHUB_ID=your_client_id
- GITHUB_SECRET=your_client_secret

Important Notes:
- Keep these credentials secure and never commit them to version control
- The callback URL must exactly match what's configured in NextAuth.js
- For production, you'll need to update the URLs to your production domain