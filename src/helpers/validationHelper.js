export function validateProfile(data, setError) {
    console.log(data)
    if (!data.fullName || data.fullName.length < 2 || data.fullName.length > 75) {
        setError("fullName", { message: "Full name must be between 2 and 75 characters" });
    }

    if (!data.pronouns) {
        setError("pronouns", { message: "Pronouns are required" });
    }

    if (data.age < 0 || data.age > 120) {
        setError("age", { message: "Age must be between 0 and 120" });
    }

    if (!data.phoneNumber || !/^\+?[0-9-]+$/.test(data.phoneNumber)) {
        setError("phoneNumber", { message: "Invalid phone number" });
    }

    if (data.bio && data.bio.length > 5000) {
        setError("bio", { message: "Bio cannot be more than 5000 characters" });
    }
}

export const validatePassword = (password, repeatPassword) => {
    let statusMessages = {};

    // Check for length
    if (!(password.length >= 8)) {
        statusMessages.length = "Password must be at least 8 characters long.";
    }

    // Check for at least one uppercase letter
    if (!(/[A-Z]/.test(password))) {
        statusMessages.uppercase = "Password must contain at least one uppercase letter.";
    }

    // Check for at least one lowercase letter
    if (!(/[a-z]/.test(password))) {
        statusMessages.lowercase = "Password must contain at least one lowercase letter.";
    }

    // Check for at least one number
    if (!(/[0-9]/.test(password))) {
        statusMessages.number = "Password must contain at least one number.";
    }

    // Check for at least one special character
    if (!(/[!@#$%^&*]/.test(password))) {
        statusMessages.specialChar = "Password must contain at least one special character (e.g., !@#$%^&*).";
    }

    // Check if password and repeatPassword are the same
    if (!(password === repeatPassword)) {
        statusMessages.repeatPassword = "Repeat password does not match.";
    }

    return statusMessages;
};

export function validateTaskForm({
    assignedTo,
    deadline,
    description,
    files
                      }) {
    const errors = {};

    // Validate AssignedTo
    if (assignedTo.length === 0) {
        errors.assignedTo = "Assign a volunteer";
    }

    // Validate Deadline
    const datePattern = /^(\d{2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{4})$/;
    if (!deadline.match(datePattern)) {
        errors.deadline = "You must set a deadline";
    }

    // Validate Description
    if (!description) {
        errors.description = "Description is required";
    } else if (description.length > 5000) {
        errors.description = "Description cannot be more than 5000 characters";
    }

    // Validate Attachments
    if (files.length > 0) {
        const fileNames = files.map(file => file.name);
        const uniqueFileNames = new Set(fileNames);

        if (fileNames.length !== uniqueFileNames.size) {
            errors.files = "Cannot have files with the same name";
        } else {
            for (const file of files) {
                if (file.size > 5000000) { // 5MB in bytes
                    errors.files = "Each file must be less than 5MB";
                    break;
                }
            }
        }
    }

    return errors;
}

export function validateRegisterForm(data, setError) {
    if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
        setError("email", { type: 'manual', message: "Valid email is required" });
    }

    if (!data.fullName || data.fullName.length < 2 || data.fullName.length > 75) {
        setError("fullName", { type: 'manual', message: "Full name must be between 2 and 75 characters" });
    }

    if (!data.pronouns) {
        setError("pronouns", { type: 'manual', message: "Pronouns are required" });
    }

    if (data.age < 0 || data.age > 120) {
        setError("age", { type: 'manual', message: "Age must be between 0 and 120" });
    }

    if (!data.phoneNumber || !/^\+?[0-9-]+$/.test(data.phoneNumber)) {
        setError("phoneNumber", { type: 'manual', message: "Invalid phone number" });
    }

    if (data.bio && data.bio.length > 5000) {
        setError("bio", { type: 'manual', message: "Bio cannot be more than 5000 characters" });
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
    if (!data.password || !passwordRegex.test(data.password)) {
        setError("password", { type: 'manual', message: "Password does not meet requirements" });
    }

    if (!data.repeatPassword || data.password !== data.repeatPassword) {
        setError("repeatPassword", { type: 'manual', message: "Passwords must match" });
    }
}