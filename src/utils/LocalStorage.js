
export function saveProfile(profile) {
    localStorage.setItem("profileInfo", JSON.stringify(profile));
}

export function getProfile() {
    return JSON.parse(localStorage.getItem("profileInfo"));
}

export function deleteProfile() {
    return localStorage.removeItem("profileInfo");
}