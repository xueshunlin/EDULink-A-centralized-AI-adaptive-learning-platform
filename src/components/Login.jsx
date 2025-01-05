import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import UserMenu from './UserMenu';
import React, { useContext } from 'react';
import { UserContext } from '../UserContext';

const client_id = "316019998539-8rm0k1tq9p6e85f9q1umi3qu6auhnbts.apps.googleusercontent.com";

async function graphQLFetch(query, variables = {}) {
    try {
        const response = await fetch('http://127.0.0.1:8000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Server error response: ${errorText}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.errors) {
            const error = result.errors[0];
            if (error.extensions && error.extensions.code === 'BAD_USER_INPUT') {
                const details = error.extensions.exception ? error.extensions.exception.errors.join('\n ') : '';
                alert(`${error.message}:
 ${details}`);
            } else {
                alert(`${error.extensions ? error.extensions.code : 'Error'}: ${error.message}`);
            }
            return null; // Return null if there's an error in the GraphQL response
        }

        return result.data;
    } catch (e) {
        alert(`Error in sending data to server: ${e.message}`);
        console.error(`Fetch error: ${e.message}`);
        return null; // Return null in case of network or parsing errors
    }
}

function Login() {
    // const [user, setUser] = useState(null);
    const { user, login, logout } = useContext(UserContext);
    const onSuccess = async (res) => {
        console.log("LOGIN SUCCESS! Raw response:", res);
        try {
            // Decode JWT token to get user information
            const decodedToken = jwtDecode(res.credential);
            // console.log("User Information:", decodedToken);
            // Extract user info from the decoded token
            console.log("Decoded Token:", decodedToken);
            const userProfile = {
                id: decodedToken.exp,
                fullName: decodedToken.name,
                email: decodedToken.email,
                picture: decodedToken.picture
            };
            console.log("User Profile:", userProfile);
            // Store user profile in state and add to the database
            // setUser(userProfile);
            await addUser(userProfile);
            login(userProfile);
        } catch (error) {
            console.error("Error decoding token or sending data:", error);
        }
    };

    const addUser = async (userProfile) => {
        const mutation = `
        mutation AddUser($user: InputUser!) {
          addUser(user: $user) {
            id
            fullName
            email
            picture
          }
        }
        `;

        const variables = { user: userProfile };

        const response = await graphQLFetch(mutation, variables);

        if (!response) {
            console.error("No response from server.");
            alert("Failed to add user due to a server error.");
            return;
        }

        if (response.addUser) {
            alert(`Hi! ${userProfile.fullName}, you have successfully logged in.`);
        } else {
            alert('An unexpected error occurred while adding the user.');
        }
    };

    const onLogout = () => {
        setUser(null);
    };

    const onFailure = (error) => {
        console.error("LOGIN FAILED:", error);
        alert("Login failed. Please try again.");
    };

    return (
        <GoogleOAuthProvider clientId={client_id}>
            {!user ? (
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                />
            ) : (
                <div>
                    <UserMenu
                        fullname={user.fullName}
                        email={user.email}
                        profilePicture={user.picture}
                        onLogout={onLogout}
                    />
                </div>
            )}
        </GoogleOAuthProvider>
    );
}

export default Login;
