/*

  After the user signs up, AWS will send an email to the user containing a confirmation code. This confirmation code must be used to confirm the account and receive the authentication token.

  curl --location --request POST 'https://iz1ul818p3.execute-api.us-east-1.amazonaws.com/Prod/refresh' \
  --header 'Content-Type: application/json' \
  --data-raw '{"refreshToken":"p6t3JnBxAoAkooXd7YSZnd8KpTQks7wGnHklUPTZzZ3-YO8lSmqWNodXsiWscpp2w-FwmqQ6JiEQyQklrgIJZCoGT2gFkdg53NttV4SaYRwp4Mf12lmDHZPEyUlrTCRGDEnOq-Z_vTVCwcfiAGTS6OdK8omKjzcRXbiXDJDAfpE609sy5mRwLp3X9G9mgT-QfelvBJK4ZJXVOd5SWcaqOkVVEx3UQy_kfh0M5vkfDYsTzPw1HGOfAH_Bf4ieUrejZXVo5egDKR90OVID3Zd5gKWW0qrijf69Li1cw2eewcclkEJvcbN93gIzZpC8sAaUzTXywnU"
  }'
*/

const AWS = require("aws-sdk");

exports.confirmHandler = async (event) => {
  try {
    const cognitoIdentityServiceProvider =
      new AWS.CognitoIdentityServiceProvider();
    const { email, password, confirmationCode } = JSON.parse(event.body);

    const confirmSignUpParams = {
      ClientId: "qf3oj4jkp9p1agcnkdmnm7gbj",
      ConfirmationCode: confirmationCode,
      Username: email,
    };
    await cognitoIdentityServiceProvider
      .confirmSignUp(confirmSignUpParams)
      .promise();

    const authParams = {
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "qf3oj4jkp9p1agcnkdmnm7gbj",
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    const authResponse = await cognitoIdentityServiceProvider
      .initiateAuth(authParams)
      .promise();
    const token = authResponse.AuthenticationResult;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "User has been signed up successfully.",
        token: token,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
