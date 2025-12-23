# EVA Script - Authentication System

Complete authentication system for the EVA Script ChatKit agent with two login methods for 80+ users.

## 🚀 Quick Setup

### 1. Generate Password Hashes
```bash
# For shared password (Option 1)
node generate-password-hash.js

# For individual users (Option 2)
node generate-user-hashes.js
```

### 2. Configure Netlify Environment Variables
Add these in your Netlify dashboard (Site Settings > Environment Variables):

**Required for both options:**
- `AUTH_SALT` - Random salt string for password security
- `OPENAI_API_KEY` - Your OpenAI API key
- `CHATKIT_WORKFLOW_ID` - Your ChatKit workflow ID

**For Option 1 (Shared Password):**
- `EVA_PASSWORD_HASH` - Hashed version of shared password

### 3. Deploy to Netlify
Your site will automatically work with both authentication methods.

## 🔐 Authentication Options

### Option 1: Shared Password
- **URL:** `/login.html`
- **Users:** All 80+ users share one password
- **Best for:** Quick deployment, simple management

### Option 2: Individual Accounts
- **URL:** `/user-login.html`
- **Users:** Each user has unique username/password
- **Best for:** Better security, user tracking
- **Admin Panel:** `/admin-panel.html` (admin users only)

## 📁 File Structure

```
├── index.html                    # Main chat interface (protected)
├── login.html                    # Shared password login
├── user-login.html              # Individual user login
├── admin-panel.html             # Admin management panel
├── generate-password-hash.js    # Generate shared password hash
├── generate-user-hashes.js      # Generate individual user hashes
└── netlify/functions/
    ├── auth-login.mjs           # Shared password authentication
    ├── auth-user-login.mjs      # Individual user authentication
    └── chatkit-session.mjs      # Original ChatKit session handler
```

## 🔧 User Management

### Adding New Users (Option 2)
1. Edit `generate-user-hashes.js`
2. Add user to the `USERS` array:
   ```javascript
   { username: 'newuser', password: 'NewPassword123!', name: 'New User', role: 'user' }
   ```
3. Run: `node generate-user-hashes.js`
4. Copy the generated `USERS_DB` object to `auth-user-login.mjs`
5. Redeploy your site

### Changing Shared Password (Option 1)
1. Edit password in `generate-password-hash.js`
2. Run: `node generate-password-hash.js`
3. Update `EVA_PASSWORD_HASH` environment variable in Netlify
4. Redeploy your site

## 🌐 Access URLs

- **Main Chat:** `https://yoursite.netlify.app/`
- **Shared Login:** `https://yoursite.netlify.app/login.html`
- **Individual Login:** `https://yoursite.netlify.app/user-login.html`
- **Admin Panel:** `https://yoursite.netlify.app/admin-panel.html`

## 🔒 Security Features

- **Password Hashing:** SHA-256 with salt
- **Session Management:** 24-hour token expiration
- **CORS Protection:** Configured for Netlify functions
- **Role-Based Access:** Admin vs user roles
- **Auto-Redirect:** Unauthenticated users redirected to login
- **Token Validation:** Expired tokens automatically cleared

## 🛠️ Troubleshooting

### Users Can't Login
1. Check environment variables are set in Netlify
2. Verify password hashes were generated correctly
3. Check browser console for errors
4. Ensure functions are deployed properly

### Admin Panel Not Working
1. Ensure user has `role: 'admin'` in the database
2. Check that user logged in via `/user-login.html`
3. Verify token contains user information

### Chat Not Loading
1. Confirm `OPENAI_API_KEY` and `CHATKIT_WORKFLOW_ID` are set
2. Check that user is authenticated
3. Verify ChatKit session function is working

## 📊 User Credentials (Option 2)

Default users created by `generate-user-hashes.js`:
- **Admin:** username: `admin`, password: `AdminEVA2024!`
- **User1:** username: `user1`, password: `User1EVA2024!`
- **User2:** username: `user2`, password: `User2EVA2024!`

**⚠️ Change these passwords before production use!**

## 🔄 Migration Path

1. **Start with Option 1** for immediate protection
2. **Upgrade to Option 2** when you need individual accounts
3. Both systems work simultaneously
4. Users can switch between login methods

## 📞 Support

For issues:
1. Check browser console for errors
2. Verify Netlify function logs
3. Confirm environment variables are set
4. Test with simple password first

---

**Security Note:** Delete `generate-password-hash.js` and `generate-user-hashes.js` after setup to protect your passwords.
