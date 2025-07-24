const showPass = document.getElementById("showPass");

if (showPass) { // Check if the checkbox exists
    showPass.addEventListener("click", function() {
        const passwordInput = document.getElementById("accountPassword");
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    });
}