// ==========================================
// CONFIG
// ==========================================
const API_BASE = "https://edv4n7mwc3.execute-api.ap-south-1.amazonaws.com/prod";
let USE_DEMO = false; // auto-detected

// ==========================================
// HEALTH CHECK — FIXED (uses OPTIONS /resume)
// ==========================================
async function checkApiStatus() {
    try {
        const res = await fetch(`${API_BASE}/resume`, {
            method: "OPTIONS"
        });

        if (res.ok) {
            USE_DEMO = false;
            setModeBadge("live");
            console.log("API Status: LIVE");
        } else {
            USE_DEMO = true;
            setModeBadge("demo");
            console.log("API Status: DEMO (fallback)");
        }

    } catch (err) {
        USE_DEMO = true;
        setModeBadge("demo");
        console.log("API unreachable → Demo Mode activated");
    }
}

checkApiStatus();

// ==========================================
// MODE BADGE UI
// ==========================================
function setModeBadge(mode) {
    const badge = document.getElementById("modeBadge");
    if (!badge) return;

    if (mode === "live") {
        badge.innerText = "Live Mode (AWS)";
        badge.style.background = "#28a745";
    } else {
        badge.innerText = "Demo Mode (Local)";
        badge.style.background = "#dc3545";
    }
}

// ==========================================
// DEMO STORAGE (only used if AWS offline)
// ==========================================
let demoStorage = {};

async function demoSave(data) {
    demoStorage[data.email] = data;
    return { message: "Saved (Demo Mode)" };
}

async function demoUpdate(data) {
    demoStorage[data.email] = data;
    return { message: "Updated (Demo Mode)" };
}

async function demoLoad(email) {
    return demoStorage[email] || {};
}

async function demoDownload(email) {
    return { download_url: "https://example.com/demo.pdf" };
}

// ==========================================
// SKILLS
// ==========================================
let skills = [];

function addSkill() {
    const input = document.getElementById("skillInput");
    const value = input.value.trim();
    if (value !== "") {
        skills.push(value);
        input.value = "";
        renderSkills();
        renderPreview();
    }
}

function renderSkills() {
    const list = document.getElementById("skillsList");
    list.innerHTML = "";
    skills.forEach((skill, index) => {
        const li = document.createElement("li");
        li.textContent = skill + " ";
        const btn = document.createElement("button");
        btn.textContent = "x";
        btn.style.marginLeft = "10px";
        btn.onclick = () => {
            skills.splice(index, 1);
            renderSkills();
            renderPreview();
        };
        li.appendChild(btn);
        list.appendChild(li);
    });
}

// ==========================================
// EXPERIENCE
// ==========================================
let experience = [];

function addExperience() {
    const container = document.getElementById("experienceContainer");

    const div = document.createElement("div");
    div.className = "experience-block";

    div.innerHTML = `
        <label>Role</label>
        <input type="text" class="exp-role">

        <label>Company</label>
        <input type="text" class="exp-company">

        <label>Start</label>
        <input type="text" class="exp-start">

        <label>End</label>
        <input type="text" class="exp-end">

        <label>Details (each bullet new line)</label>
        <textarea class="exp-details"></textarea>

        <hr>
    `;
    container.appendChild(div);
}

// ==========================================
// EDUCATION
// ==========================================
let education = [];

function addEducation() {
    const container = document.getElementById("educationContainer");

    const div = document.createElement("div");
    div.className = "education-block";

    div.innerHTML = `
        <label>Degree</label>
        <input type="text" class="edu-degree">

        <label>Institution</label>
        <input type="text" class="edu-institution">

        <label>Year</label>
        <input type="text" class="edu-year">

        <hr>
    `;
    container.appendChild(div);
}

// ==========================================
// LIVE PREVIEW
// ==========================================
function renderPreview() {
    const preview = document.getElementById("preview");

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const summary = document.getElementById("summary").value;

    // Experience
    const expBlocks = document.querySelectorAll(".experience-block");
    experience = [];
    expBlocks.forEach(block => {
        experience.push({
            role: block.querySelector(".exp-role").value,
            company: block.querySelector(".exp-company").value,
            start: block.querySelector(".exp-start").value,
            end: block.querySelector(".exp-end").value,
            details: block.querySelector(".exp-details").value.split("\n")
        });
    });

    // Education
    const eduBlocks = document.querySelectorAll(".education-block");
    education = [];
    eduBlocks.forEach(block => {
        education.push({
            degree: block.querySelector(".edu-degree").value,
            institution: block.querySelector(".edu-institution").value,
            year: block.querySelector(".edu-year").value
        });
    });

    preview.innerHTML = `
        <h2>${name}</h2>
        <p>${email} | ${phone}</p>

        <h3>Professional Summary</h3>
        <p>${summary}</p>

        <h3>Skills</h3>
        <p>${skills.join(", ")}</p>

        <h3>Experience</h3>
        ${experience.map(exp => `
            <strong>${exp.role} — ${exp.company}</strong><br>
            <em>${exp.start} to ${exp.end}</em>
            <ul>
                ${exp.details.map(d => `<li>${d}</li>`).join("")}
            </ul>
        `).join("")}

        <h3>Education</h3>
        ${education.map(edu => `
            <strong>${edu.degree}</strong><br>
            ${edu.institution} (${edu.year})<br><br>
        `).join("")}
    `;
}

document.addEventListener("input", renderPreview);

// ==========================================
// COLLECT DATA
// ==========================================
function collectResumeData() {
    return {
        email: document.getElementById("email").value,
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        summary: document.getElementById("summary").value,
        skills,
        experience,
        education
    };
}

// ==========================================
// SAVE RESUME
// ==========================================
async function saveResume() {
    const payload = collectResumeData();

    if (USE_DEMO) {
        const r = await demoSave(payload);
        alert(r.message);
        return;
    }

    const res = await fetch(`${API_BASE}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert(data.message || "Saved");
}

// ==========================================
// UPDATE RESUME
// ==========================================
async function updateResume() {
    const payload = collectResumeData();

    if (USE_DEMO) {
        const r = await demoUpdate(payload);
        alert(r.message);
        return;
    }

    const res = await fetch(`${API_BASE}/resume/${payload.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert(data.message || "Updated");
}

// ==========================================
// LOAD RESUME
// ==========================================
async function loadResume() {
    const email = document.getElementById("email").value;

    let data;

    if (USE_DEMO) {
        data = await demoLoad(email);
    } else {
        const res = await fetch(`${API_BASE}/resume/${email}`);
        data = await res.json();
    }

    document.getElementById("name").value = data.name || "";
    document.getElementById("phone").value = data.phone || "";
    document.getElementById("summary").value = data.summary || "";

    skills = data.skills || [];
    renderSkills();

    document.getElementById("experienceContainer").innerHTML = "";
    (data.experience || []).forEach(exp => {
        addExperience();
        const block = document.querySelector(".experience-block:last-child");
        block.querySelector(".exp-role").value = exp.role || "";
        block.querySelector(".exp-company").value = exp.company || "";
        block.querySelector(".exp-start").value = exp.start || "";
        block.querySelector(".exp-end").value = exp.end || "";
        block.querySelector(".exp-details").value = (exp.details || []).join("\n");
    });

    document.getElementById("educationContainer").innerHTML = "";
    (data.education || []).forEach(edu => {
        addEducation();
        const block = document.querySelector(".education-block:last-child");
        block.querySelector(".edu-degree").value = edu.degree || "";
        block.querySelector(".edu-institution").value = edu.institution || "";
        block.querySelector(".edu-year").value = edu.year || "";
    });

    renderPreview();
}

// ==========================================
// DOWNLOAD PDF
// ==========================================
async function downloadResume() {
    const email = document.getElementById("email").value;

    let data;

    if (USE_DEMO) {
        data = await demoDownload(email);
    } else {
        const res = await fetch(`${API_BASE}/resume/${email}/download`);
        data = await res.json();
    }

    if (data.download_url) {
        window.open(data.download_url, "_blank");
    } else {
        alert("Error generating PDF");
    }
}
