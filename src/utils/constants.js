// fields to be retrieved in Populate
const STUDENT = 'fullName mobileNumber';
const YEAR = 'name';
const POINT_TYPE = 'name value';
const CLASS = 'name';
const SERVANT = 'name';
const BATCH = 'name currYear';
const BATCH_YEAR = 'batch year academicYear';

// Attendance PointTypes Configuration
const ATTENDANCE_DEFAULT_POINT_TYPE_ID = "691ee3cc300cfb7450489894"; // Attendance Lvl4
const ATTENDANCE_POINT_TYPES_CONFIG = [
    {
        start: "17:30", // After 5:30 PM
        end: "18:15", // Up to 6:15 PM
        pointTypeId: "691ee363300cfb745048988b" // Attendance Lvl1 40
    },
    {
        start: "18:16", // After 6:16 PM
        end: "18:30", // Up to 6:30 PM
        pointTypeId: "691ee37f300cfb745048988e" // Attendance Lvl2 20
    },
    {
        start: "18:31", // After 6:31 PM
        end: "19:00", // Up to 7:00 PM
        pointTypeId: "691ee3b2300cfb7450489891" // Attendance Lvl3 10
    },
    {
        start: "19:01", // After 7:01 PM
        end: "23:59", // Up to Midnight
        pointTypeId: "691ee3cc300cfb7450489894" // Attendance Lvl4 5
    }
];

const CONFESSION_CONFIG_NAME = "Confession";
const CONFESSION_CONFIG_ID = "691ee3df300cfb7450489897";
const MASS_CONFIG_NAME = "Mass";
const MASS_CONFIG_ID = "691ee3e9300cfb745048989a";

// ================ GLOBAL ERROR MESSAGES ===================
const ERROR_MESSAGES = {
    AUTH: {
        TOKEN_MISSING: "Authorization token missing.",
        TOKEN_INVALID: "Invalid or expired token.",
        ADMIN_ONLY: "Admin privileges are required.",
        AMIN_ONLY: "Amin privileges are required.",
        ADMIN_OR_AMIN_ONLY: "Admin or Amin privileges are required.",
        INVALID_LOGIN: "Invalid email or password.",
        INVALID_CURRENT_PASSWORD: "The current password is incorrect.",
    },

    YEAR: {
        NOT_FOUND: "Year not found.",
    },

    STUDENT: {
        NOT_FOUND: "Student not found.",
    },

    STUDENT_YEAR_SUMMARY: {
        NOT_FOUND: "Student Year Summary not found.",
    },

    SERVANT: {
        NOT_FOUND: "Servant not found.",
    },

    ATTENDANCE: {
        NOT_FOUND: "Attendance not found.",
        FAILED_CREATE: "Failed to create Attendance record.",
    },

    CONFESSION: {
        NOT_FOUND: "Confession not found.",
        FAILED_CREATE: "Failed to create Confession record.",
    },

    MASS: {
        NOT_FOUND: "Mass not found.",
        FAILED_CREATE: "Failed to create Mass record.",
    },

    HOME_VISIT: {
        NOT_FOUND: "Home Visit not found.",
        FAILED_CREATE: "Failed to create Home Visit record.",
    },

    POINT: {
        NOT_FOUND: "Point not found.",
    },

    POINT_TYPE: {
        NOT_FOUND: "Point Type not found.",
    },

    BATCH: {
        NOT_FOUND: "Batch not found.",
    },

    BATCH_YEAR: {
        NOT_FOUND: "Batch Year not found.",
    },

    CLASS: {
        NOT_FOUND: "Class not found."
    },

    GENERAL: {
        DUPLICATE_KEY: "Duplicate value for: {fields}.",
        VALIDATION_ERROR: "Validation error occurred.",
        SERVER_ERROR: "Internal server error.",
        // NOT_FOUND: "Resource not found.",
        // BAD_REQUEST: "Bad request.",
    }
};
// ==========================================================

// ================ GLOBAL SUCCESS MESSAGES =================
const SUCCESS_MESSAGES = {
    AUTH: {
        LOGOUT_SUCCESS: "Logged out successfully",
        PASSWORD_CHANGE_SUCCESS: "Password updated successfully",
        PASSWORD_RESET_SUCCESS: "Password reset successfully"
    }
}
// ==========================================================

module.exports = {
    STUDENT,
    YEAR,
    POINT_TYPE,
    CLASS,
    SERVANT,
    BATCH,
    BATCH_YEAR,
    ATTENDANCE_DEFAULT_POINT_TYPE_ID,
    ATTENDANCE_POINT_TYPES_CONFIG,
    CONFESSION_CONFIG_ID,
    CONFESSION_CONFIG_NAME,
    MASS_CONFIG_ID,
    MASS_CONFIG_NAME,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES
};