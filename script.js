document.getElementById("confirmFamilyNameBtn").addEventListener("click", function () {
    const familyName = document.getElementById("familyNameInput").value.trim();
    const displayElement = document.getElementById("familyNameDisplay");
    displayElement.textContent = familyName.toUpperCase();
});

// Modal functionality
const memberModal = document.getElementById("memberFormModal");
const wifeModal = document.getElementById("wifeFormModal");
const detailsModal = document.getElementById("detailsModal");
const addTypeModal = document.getElementById("addTypeModal");
const closeMemberModal = document.getElementById("closeModal");
const closeWifeModal = document.getElementById("closeWifeModal");
const closeDetailsModal = document.getElementById("closeDetailsModal");
const closeAddTypeModal = document.getElementById("closeAddTypeModal");
let memberCount = 2; // Start from 2 as first couple has IDs 1 and 2
let coupleCount = 1;
const membersData = {}; // Store member details

// Add New Couple Button
document.getElementById("addNewCoupleBtn").addEventListener("click", function () {
    addTypeModal.style.display = "block";
});

document.getElementById("addSingleBtn").addEventListener("click", function () {
    addTypeModal.style.display = "none";
    memberCount++;
    const memberList = document.getElementById("memberList");
    const newMember = document.createElement("div");
    newMember.className = "member-item";
    newMember.setAttribute("data-member-id", memberCount);
    newMember.innerHTML = `
        <img id="memberPhoto${memberCount}" src="" alt="Member Photo" style="display: none;" />
        <div class="name-container">
            <div class="name-display" id="memberNameDisplay${memberCount}"></div>
            <button id="addMemberBtn${memberCount}" class="plus-btn">+</button>
        </div>
        <button id="editMemberBtn${memberCount}" class="edit-btn" style="display: none;">Edit</button>
    `;
    memberList.appendChild(newMember);
    setupMemberBoxListeners(memberCount, null, null);
});

document.getElementById("addMarriedBtn").addEventListener("click", function () {
    addTypeModal.style.display = "none";
    coupleCount++;
    memberCount += 2; // Increment by 2 for husband and wife
    const memberList = document.getElementById("memberList");
    const newCoupleGroup = document.createElement("div");
    newCoupleGroup.className = "couple-group";
    newCoupleGroup.setAttribute("data-couple-id", coupleCount);
    newCoupleGroup.innerHTML = `
        <div class="member-item" data-member-id="${memberCount-1}" data-role="husband">
            <img id="memberPhoto${memberCount-1}" src="" alt="Member Photo" style="display: none;" />
            <div class="name-container">
                <div class="name-display" id="memberNameDisplay${memberCount-1}"></div>
                <button id="addMemberBtn${memberCount-1}" class="plus-btn">+</button>
            </div>
            <button id="editMemberBtn${memberCount-1}" class="edit-btn" style="display: none;">Edit</button>
        </div>
        <div class="member-item" data-member-id="${memberCount}" data-role="wife">
            <img id="memberPhoto${memberCount}" src="" alt="Member Photo" style="display: none;" />
            <div class="name-container">
                <div class="name-display" id="memberNameDisplay${memberCount}"></div>
                <button id="addMemberBtn${memberCount}" class="plus-btn">+</button>
            </div>
            <button id="editMemberBtn${memberCount}" class="edit-btn" style="display: none;">Edit</button>
        </div>
    `;
    memberList.appendChild(newCoupleGroup);

    // Add event listeners for new buttons
    setupMemberBoxListeners(memberCount-1, coupleCount, "husband");
    setupMemberBoxListeners(memberCount, coupleCount, "wife");
});

closeAddTypeModal.addEventListener("click", () => {
    addTypeModal.style.display = "none";
});

// Setup listeners for member box
function setupMemberBoxListeners(memberId, coupleId, role) {
    const memberBox = document.querySelector(`.member-item[data-member-id="${memberId}"]`);
    
    // Click on box to show details
    memberBox.addEventListener("click", (event) => {
        if (event.target.classList.contains("plus-btn") || event.target.classList.contains("edit-btn")) return;
        showMemberDetails(memberId);
    });

    // Add button
    document.getElementById(`addMemberBtn${memberId}`).addEventListener("click", () => {
        document.getElementById(role === "husband" ? "currentMemberId" : "currentWifeMemberId").value = memberId;
        document.getElementById(role === "husband" ? "currentCoupleId" : "currentWifeCoupleId").value = coupleId;
        (role === "husband" ? memberModal : wifeModal).style.display = "block";
    });

    // Edit button
    document.getElementById(`editMemberBtn${memberId}`).addEventListener("click", () => {
        document.getElementById(role === "husband" ? "currentMemberId" : "currentWifeMemberId").value = memberId;
        document.getElementById(role === "husband" ? "currentCoupleId" : "currentWifeCoupleId").value = coupleId;
        prefillForm(memberId, role);
        (role === "husband" ? memberModal : wifeModal).style.display = "block";
    });
}

// Prefill form for editing
function prefillForm(memberId, role) {
    const data = membersData[memberId];
    if (!data) return;

    if (role === "husband") {
        document.getElementById("fullName").value = data.fullName || "";
        document.getElementById("gender").value = data.gender || "";
        document.getElementById("dob").value = data.dob || "";
        document.getElementById("isDeceased").checked = data.isDeceased || false;
        document.getElementById("deathDateDiv").style.display = data.isDeceased ? "block" : "none";
        document.getElementById("deathDate").value = data.deathDate || "";
        document.getElementById("mobileNo").value = data.mobileNo || "";
        document.getElementById("village").value = data.village || "";
        document.getElementById("khandan").value = data.khandan || "";
    } else {
        document.getElementById("wifeFullName").value = data.fullName || "";
        document.getElementById("wifeGender").value = data.gender || "";
        document.getElementById("wifeDob").value = data.dob || "";
        document.getElementById("wifeIsDeceased").checked = data.isDeceased || false;
        document.getElementById("wifeDeathDateDiv").style.display = data.isDeceased ? "block" : "none";
        document.getElementById("wifeDeathDate").value = data.deathDate || "";
        document.getElementById("wifeMobileNo").value = data.mobileNo || "";
        document.getElementById("wifeVillage").value = data.village || "";
        document.getElementById("wifeKhandan").value = data.khandan || "";
    }
}

// Show member details
function showMemberDetails(memberId) {
    const data = membersData[memberId] || {};
    const detailsDiv = document.getElementById("memberDetails");
    detailsDiv.innerHTML = `
        ${data.photo ? `<img src="${data.photo}" alt="Member Photo" />` : ""}
        <p><strong>नाम:</strong> ${data.fullName || "N/A"}</p>
        ${data.gender ? `<p><strong>लिंग:</strong> ${data.gender}</p>` : ""}
        ${data.dob ? `<p><strong>जन्म तिथि:</strong> ${data.dob}</p>` : ""}
        ${data.isDeceased ? `<p><strong>मृत्यु की स्थिति:</strong> हाँ</p>` : ""}
        ${data.deathDate ? `<p><strong>मृत्यु तिथि:</strong> ${data.deathDate}</p>` : ""}
        ${data.mobileNo ? `<p><strong>मोबाइल नंबर:</strong> ${data.mobileNo}</p>` : ""}
        ${data.village ? `<p><strong>गाँव:</strong> ${data.village}</p>` : ""}
        ${data.khandan ? `<p><strong>खानदान:</strong> ${data.khandan}</p>` : ""}
    `;
    detailsModal.style.display = "block";
}

closeMemberModal.addEventListener("click", () => {
    memberModal.style.display = "none";
});

closeWifeModal.addEventListener("click", () => {
    wifeModal.style.display = "none";
});

closeDetailsModal.addEventListener("click", () => {
    detailsModal.style.display = "none";
});

closeAddTypeModal.addEventListener("click", () => {
    addTypeModal.style.display = "none";
});

// Close modals when clicking outside
window.addEventListener("click", (event) => {
    if (event.target === memberModal) memberModal.style.display = "none";
    if (event.target === wifeModal) wifeModal.style.display = "none";
    if (event.target === detailsModal) detailsModal.style.display = "none";
    if (event.target === addTypeModal) addTypeModal.style.display = "none";
});

// Show/hide death date based on checkbox
document.getElementById("isDeceased").addEventListener("change", function () {
    const deathDateDiv = document.getElementById("deathDateDiv");
    deathDateDiv.style.display = this.checked ? "block" : "none";
});

document.getElementById("wifeIsDeceased").addEventListener("change", function () {
    const deathDateDiv = document.getElementById("wifeDeathDateDiv");
    deathDateDiv.style.display = this.checked ? "block" : "none";
});

// Husband form submission
document.getElementById("memberForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const memberId = document.getElementById("currentMemberId").value;
    const fullName = document.getElementById("fullName").value.trim();
    const gender = document.getElementById("gender").value;
    const dob = document.getElementById("dob").value;
    const isDeceased = document.getElementById("isDeceased").checked;
    const deathDate = document.getElementById("deathDate").value;
    const mobileNo = document.getElementById("mobileNo").value.trim();
    const village = document.getElementById("village").value.trim();
    const khandan = document.getElementById("khandan").value.trim();
    const photoInput = document.getElementById("photoUpload");
    const memberPhoto = document.getElementById(`memberPhoto${memberId}`);
    const nameDisplay = document.getElementById(`memberNameDisplay${memberId}`);

    // Store data
    membersData[memberId] = {
        fullName,
        gender,
        dob,
        isDeceased,
        deathDate,
        mobileNo,
        village,
        khandan,
        photo: ""
    };

    // Update name and apply color based on gender
    nameDisplay.textContent = fullName;
    updateNameColor(nameDisplay, gender);

    // Update photo
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            memberPhoto.src = e.target.result;
            memberPhoto.style.display = "block";
            membersData[memberId].photo = e.target.result;
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        memberPhoto.src = "";
        memberPhoto.style.display = "none";
    }

    // Hide add button and show edit button
    document.getElementById(`addMemberBtn${memberId}`).style.display = "none";
    document.getElementById(`editMemberBtn${memberId}`).style.display = "block";

    memberModal.style.display = "none";
    this.reset();
    document.getElementById("deathDateDiv").style.display = "none";
});

// Wife form submission
document.getElementById("wifeForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const memberId = document.getElementById("currentWifeMemberId").value;
    const fullName = document.getElementById("wifeFullName").value.trim();
    const gender = document.getElementById("wifeGender").value;
    const dob = document.getElementById("wifeDob").value;
    const isDeceased = document.getElementById("wifeIsDeceased").checked;
    const deathDate = document.getElementById("wifeDeathDate").value;
    const mobileNo = document.getElementById("wifeMobileNo").value.trim();
    const village = document.getElementById("wifeVillage").value.trim();
    const khandan = document.getElementById("wifeKhandan").value.trim();
    const photoInput = document.getElementById("wifePhotoUpload");
    const memberPhoto = document.getElementById(`memberPhoto${memberId}`);
    const nameDisplay = document.getElementById(`memberNameDisplay${memberId}`);

    // Store data
    membersData[memberId] = {
        fullName,
        gender,
        dob,
        isDeceased,
        deathDate,
        mobileNo,
        village,
        khandan,
        photo: ""
    };

    // Update name and apply color based on gender
    nameDisplay.textContent = fullName;
    updateNameColor(nameDisplay, gender);

    // Update photo
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            memberPhoto.src = e.target.result;
            memberPhoto.style.display = "block";
            membersData[memberId].photo = e.target.result;
        };
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        memberPhoto.src = "";
        memberPhoto.style.display = "none";
    }

    // Hide add button and show edit button
    document.getElementById(`addMemberBtn${memberId}`).style.display = "none";
    document.getElementById(`editMemberBtn${memberId}`).style.display = "block";

    wifeModal.style.display = "none";
    this.reset();
    document.getElementById("wifeDeathDateDiv").style.display = "none";
});

// Function to update name display color based on gender
function updateNameColor(element, gender) {
    element.className = "name-display"; // Reset classes
    if (gender === "Male") {
        element.classList.add("male");
    } else if (gender === "Female") {
        element.classList.add("female");
    } else if (gender === "Other" || gender === "Prefer Not to Say") {
        element.classList.add(gender.toLowerCase().replace(" ", "-"));
    } else {
        element.classList.add("mixed");
    }
}

// Initial add/edit button listeners for first couple
setupMemberBoxListeners(1, 1, "husband");
setupMemberBoxListeners(2, 1, "wife");