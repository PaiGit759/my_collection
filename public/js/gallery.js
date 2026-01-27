const itemsPerPage = 18;
const pagesPerGroup = 5;
let currentPage = 1;
let totalItems = 0;


function showSpinner() {
    document.getElementById("spinner").style.display = "block";
}

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}

async function fetchTotalCount() {
    try {
        const res = await fetch('/gallery/count');
        const data = await res.json();
        totalItems = data.count;
        renderPagination();

        const params = new URLSearchParams(window.location.search);
        currentPage = parseInt(params.get("page")) || 1;

        fetchGalleryPage(currentPage);
    } catch (err) {
        console.error('Error getting number of objects:', err);
    }
}

async function fetchGalleryPage(page) {
    //    showSpinner();
    try {
        const res = await fetch(`/gallerypage?page=${page}&limit=${itemsPerPage}`);
        const data = await res.json();

        const pageObjects = data.map((item, i) => ({
            title: item.title || `${i + 1}`,
            img: item.foto ? `/image/${item.foto}` : `https://images.unsplash.com/photo-1543466835-00a7907e9de1`,
            formattedDate: new Date(item.createdAt).toISOString().replace('T', ' ').slice(0, 19),
            id: item._id,
        }));

        renderGallery(pageObjects, page);
    } catch (err) {
        console.error('Ошибка загрузки страницы галереи:', err);
    }
    finally {
        //        hideSpinner();
    }
}

async function renderGallery(pageItems, page) {
    showSpinner();

    localStorage.setItem('galleryPage', page);

    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    const pageHeader = document.createElement("h5");
    pageHeader.className = "text-center my-3";
    pageHeader.textContent = `Page № ${page}`;
    gallery.appendChild(pageHeader);

    let i = 0;

    pageItems.forEach((obj) => {
        const col = document.createElement("div");
        col.className = "col-12 col-sm-6 col-md-3 col-lg-2";

        col.innerHTML = `
            <div class="card h-100">
                <img src="${obj.img}" class="card-img-top" alt="${obj.title}" />
                <div class="card-body text-center">
                    <h6 class="card-title"><b>${obj.title}</b></h6>
                    <h6 class="card-title"> № ${i + 1 + 18 * (page - 1)}(${obj.formattedDate})</h6>
                    <a href="/collection/?id=${obj.id}" class="btn btn-primary btn-sm"
                       onclick="localStorage.setItem('galleryPage', ${page})">Read more</a>
                </div>
            </div>
        `;

        gallery.appendChild(col);
        i++;
    });

    // We are waiting for all images to load.
    const images = gallery.querySelectorAll("img");
    await Promise.all(
        Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = img.onerror = resolve;
            });
        })
    );

    hideSpinner();
}



function renderPagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const groupIndex = Math.floor((currentPage - 1) / pagesPerGroup);
    const start = groupIndex * pagesPerGroup + 1;
    const end = Math.min(start + pagesPerGroup - 1, totalPages);

    pagination.appendChild(createPageItem("<<", 1, currentPage === 1));
    pagination.appendChild(createPageItem("<", start - 1, start === 1));

    for (let i = start; i <= end; i++) {
        const li = createPageItem(i, i, false, i === currentPage);
        pagination.appendChild(li);
    }

    pagination.appendChild(createPageItem(">", end + 1, end === totalPages));
    pagination.appendChild(createPageItem(">>", totalPages, currentPage === totalPages));
}

function createPageItem(label, page, disabled, active = false) {

    const li = document.createElement("li");
    li.className = `page-item ${disabled ? "disabled" : ""}`;
    const btn = document.createElement("button");
    btn.className = `page-link page-btn ${active ? "active" : ""}`;

    btn.textContent = label;
    btn.onclick = () => {
        if (!disabled) {
            currentPage = page;

            fetchGalleryPage(currentPage);
            renderPagination();
        }
    };
    li.appendChild(btn);
    return li;
}

fetchTotalCount();
function renderPagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const groupIndex = Math.floor((currentPage - 1) / pagesPerGroup);
    const start = groupIndex * pagesPerGroup + 1;
    const end = Math.min(start + pagesPerGroup - 1, totalPages);

    pagination.appendChild(createPageItem("<<", 1, currentPage === 1));
    pagination.appendChild(createPageItem("<", start - 1, start === 1));

    for (let i = start; i <= end; i++) {
        const li = createPageItem(i, i, false, i === currentPage);
        pagination.appendChild(li);
    }

    pagination.appendChild(createPageItem(">", end + 1, end === totalPages));
    pagination.appendChild(createPageItem(">>", totalPages, currentPage === totalPages));
}

function createPageItem(label, page, disabled, active = false) {
    const li = document.createElement("li");
    li.className = `page-item ${disabled ? "disabled" : ""}`;
    const btn = document.createElement("button");
    btn.className = `page-link page-btn ${active ? "active" : ""}`;

    btn.textContent = label;
    btn.onclick = () => {
        if (!disabled) {
            currentPage = page;
            fetchGalleryPage(currentPage);
            renderPagination();
        }
    };
    li.appendChild(btn);
    return li;
}

fetchTotalCount();

