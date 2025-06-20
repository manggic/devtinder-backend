- list of all requests
  {
  requestId:"123",
  to:"myName",
  from:"dimple",
  userId:"abc",
  status: "" // accepted , pending , rejected , ignored, interested
  }

- my all connections - ( all request with status - accepted )
- list of request i rejected - ( all request with status - rejected )
- list of pending request - ( all request with status - pending )

## authRouter

- POST /signup - register in acccount
- POST /login
- POST /logout

userRouter

- GET /user/feeds - get all users profile
- GET /user/requests/pending - all pending request
- GET /user/connections - get all connections details of current user

profileRouter

- GET /profile/view - get current profile details
- PATCH /profile/edit - edit current profile details
- PATCH /profile/password - edit password of current profile

connectionRequestRouter

- POST /request/review/accepted/:requestId - accepted a request
- POST /request/review/rejected/:requestId - rejected a request
- POST /request/send/interested/:userId - right swiped a user
- POST /request/send/ignored/:userId - left swipe a user




// logic for forgot password
1) After you click on forgot password , new UI will open, asking you to enter email.
2) After submitting the email, API will be called ('/forgot-password').
3) Backend will check if enter email is present in DB or not, if present generate a token, store it in DB, send link with attached token to the user emailId that will redirect to UI for creating new password.
4) UI will fetch token from URL params and send API ('/changePassword') with new password and token. 
5) Backend will verify the token and will update new password.   
