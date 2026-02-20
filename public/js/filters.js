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

/* document.getElementById("filterForm").addEventListener("submit", function () {
    const formData = new FormData(this);

    // Сохраняем сортировку отдельно
    const sort = formData.get("sort") || "asc";
    localStorage.setItem("sortOrder", sort);

    // Сохраняем фильтры (group, user)
    const params = new URLSearchParams();
    if (formData.get("group")) params.append("group", formData.get("group"));
    if (formData.get("user")) params.append("user", formData.get("user"));

    localStorage.setItem("galleryFilters", params.toString());
}); */

document.getElementById("filterForm").addEventListener("submit", function () {
    const formData = new FormData(this);

    const sort = formData.get("sort") || "asc";
    localStorage.setItem("sortOrder", sort);

    const params = new URLSearchParams();

    if (formData.get("group")) params.append("group", formData.get("group"));
    if (formData.get("user")) params.append("user", formData.get("user"));

    localStorage.setItem("galleryFilters", params.toString());
});



document.getElementById("resetAll").addEventListener("click", function () {
    localStorage.removeItem("galleryFilters");
    localStorage.setItem("sortOrder", "asc"); // сортировка по умолчанию
});


window.addEventListener("DOMContentLoaded", () => {
    const savedSort = localStorage.getItem("sortOrder") || "asc";

    const radio = document.querySelector(`input[name="sort"][value="${savedSort}"]`);
    if (radio) radio.checked = true;

    // Подставляем фильтры, если они есть
    const savedFilters = localStorage.getItem("galleryFilters");
    if (savedFilters) {
        const params = new URLSearchParams(savedFilters);

        if (params.get("group")) {
            document.getElementById("groupInput").value = params.get("group");
        }

        if (params.get("user")) {
            document.getElementById("userSelect").value = params.get("user");
        }
    }
});
