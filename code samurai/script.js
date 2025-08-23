document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

// Modal Variables for Projects
let currentIndex = 0;
const allImages = [
    'images/dashboard1.png',
    'images/dashboard2.png',
    'images/crime.png',
    'images/crime2.png',
    'images/expense.png'
];

function openModal(index) {
    currentIndex = index;
    showModalImage();
    document.getElementById('imageModal').style.display = 'block';
}

function showModalImage() {
    const modalImg = document.getElementById('modalImage');
    modalImg.src = allImages[currentIndex];
}

function changeModalImage(n) {
    currentIndex += n;
    if (currentIndex >= allImages.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = allImages.length - 1;
    showModalImage();
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    const profileModal = document.getElementById('profileModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    } else if (event.target === profileModal) {
        profileModal.style.display = 'none';
    }
};

// Profile Modal Functions
function openProfileModal() {
    const profileModalImg = document.getElementById('profileModalImage');
    profileModalImg.src = document.querySelector('.profile-pic').src;
    document.getElementById('profileModal').style.display = 'block';
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
}

function previewProfileImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const profileModalImg = document.getElementById('profileModalImage');
        profileModalImg.src = reader.result;
        document.querySelector('.profile-pic').src = reader.result;
    };
    reader.readAsDataURL(event.target.files[0]);
}

function deleteProfileImage() {
    document.querySelector('.profile-pic').src = '';
    document.getElementById('profileModalImage').src = '';
    closeProfileModal();
    // Note: This resets to an empty src. To restore default, manually set a default image path or handle server-side deletion if needed.
}