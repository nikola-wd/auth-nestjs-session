[] Implement refresh token rotation
[] Reuse detenction. If reuse is detected, all refresh tokens are invalidated for the user which will force a new login for authentication. And if token reuse is detected, all refresh tokens for the user will be deleted, which forces the user to log in again as soon as their access token expires
[] Implement refresh token rotation
[] Implement multiple login (from different devices). refresh token array
[] Maybe implement rate limiter
[] Implement a loger
