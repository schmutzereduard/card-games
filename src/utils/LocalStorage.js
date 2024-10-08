
export function saveProfile(profile) {
    localStorage.setItem("profileInfo", JSON.stringify(profile));
    return profile;
}

export function getProfile() {
    return JSON.parse(localStorage.getItem("profileInfo"));
}

export function deleteProfile() {
    return localStorage.removeItem("profileInfo");
}

export function extractFunds(bet) {
    const profile = getProfile();
    profile.funds = Number.parseInt(profile.funds) - Number.parseInt(bet);
    saveProfile(profile);
}

export function addFunds(win) {
    const profile = getProfile();
    profile.funds = Number.parseInt(profile.funds) + Number.parseInt(win);
    saveProfile(profile);
}