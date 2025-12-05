const API_BASE = "https://edv4n7mwc3.execute-api.ap-south-1.amazonaws.com/prod";

let isLiveAPI = false; // global mode flag

// ---------- HEALTH CHECK ----------
async function checkAPI() {
    try {
        const res = await fetch(`${API_BASE}/resume/__healthcheck__`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        // AWS responds with 404 for fake email = healthy
        if (res.ok || res.status === 404) {
            return true;
        }
        return false;

    } catch (err) {
        return false; // AWS is offline/deleted
    }
}

function enableLiveMode() {
    isLiveAPI = true;
    const badge = document.getElementById("modeBadge");
    badge.textContent = "Live Mode (AWS)";
    badge.classList.remove("badge-demo");
    badge.classList.add("badge-live");
}

function enableDemoMode() {
    isLiveAPI = false;
    const badge = document.getElementById("modeBadge");
    badge.textContent = "Demo Mode (Local)";
    badge.classList.remove("badge-live");
    badge.classList.add("badge-demo");
}

// Initialize mode on load
(async () => {
    const healthy = await checkAPI();
    healthy ? enableLiveMode() : enableDemoMode();
})();

// ---------- SKILLS ----------
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

// ---------- EXPERIENCE ----------
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

// ---------- EDUCATION ----------
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

// ---------- PREVIEW ----------
function renderPreview() {
    const preview = document.getElementById("preview");

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const summary = document.getElementById("summary").value;

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

// ---------- SAVE ----------
async function saveResume() {
    if (!isLiveAPI) return alert("Demo Mode: Saving disabled");

    const payload = collectResumeData();

    const response = await fetch(`${API_BASE}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    alert(result.message || "Saved");
}

// ---------- UPDATE ----------
async function updateResume() {
    if (!isLiveAPI) return alert("Demo Mode: Updating disabled");

    const payload = collectResumeData();

    const response = await fetch(`${API_BASE}/resume/${payload.email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const result = await response.json();
    alert(result.message || "Updated");
}

// ---------- LOAD ----------
async function loadResume() {
    if (!isLiveAPI) return alert("Demo Mode: Loading disabled");

    const email = document.getElementById("email").value;

    const response = await fetch(`${API_BASE}/resume/${email}`);
    const data = await response.json();

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

// ---------- DOWNLOAD PDF ----------
async function downloadResume() {
    if (!isLiveAPI) return alert("Demo Mode: PDF disabled");

    const email = document.getElementById("email").value;

    const response = await fetch(`${API_BASE}/resume/${email}/download`);
    const data = await response.json();

    if (data.download_url) {
        window.open(data.download_url, "_blank");
    } else {
        alert("Error generating PDF");
    }
}

function collectResumeData() {
    return {
        email: document.getElementById("email").value,
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        summary: document.getElementById("summary").value,
        skills: skills,
        experience: experience,
        education: education
    };
}
