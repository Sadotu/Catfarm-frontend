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
        setError("email", { message: "Valid email is required" });
    }

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

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
    if (!data.password || !passwordRegex.test(data.password)) {
        setError("password", { message: "Password does not meet requirements" });
    }

    if (!data.repeatPassword || data.password !== data.repeatPassword) {
        setError("repeatPassword", { message: "Passwords must match" });
    }
}