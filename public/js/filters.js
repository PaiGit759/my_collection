document.getElementById('filterForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const sort = document.querySelector('input[name="sort"]:checked').value;
    const group = this.group.value.trim();
    const user = this.user.value;

    const params = new URLSearchParams();

    params.append('sort', sort);
    if (group) params.append('group', group);
    if (user) params.append('user', user);

    window.location.href = `/?${params.toString()}`;

});
