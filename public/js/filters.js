window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('galleryFilters');
    if (!saved) return;

    const { sort, group, user } = JSON.parse(saved);

    if (sort) {
        document.querySelector(`input[name="sort"][value="${sort}"]`).checked = true;
    }
    if (group) {
        document.querySelector('input[name="group"]').value = group;
    }
    if (user) {
        document.querySelector('select[name="user"]').value = user;
    }
});


document.getElementById('filterForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const sort = document.querySelector('input[name="sort"]:checked').value;
    const group = this.group.value.trim();
    const user = this.user.value;

    // Save filters
    const filterState = { sort, group, user };
    localStorage.setItem('galleryFilters', JSON.stringify(filterState));

    const params = new URLSearchParams();
    params.append('sort', sort);
    if (group) params.append('group', group);
    if (user) params.append('user', user);

    window.location.href = `/?${params.toString()}`;
});

// Clearing a specific field
document.querySelectorAll('.clear-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target.tagName === 'SELECT') {
            target.value = "";
        } else {
            target.value = "";
        }
    });
});

// Reset all filters
document.getElementById('resetAll').addEventListener('click', () => {
    localStorage.removeItem('galleryFilters');
    window.location.href = '/sortingselection'; // или твой путь к странице сортировки
});


