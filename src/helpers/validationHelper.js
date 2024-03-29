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
        errors.deadline = "You must set a deadline in format dd/mm/yy";
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