const storedUser = localStorage.getItem('currentUser');
const user = storedUser ? JSON.parse(storedUser) : null;
const imgUser = document.getElementById('userfoto');
//console.log('*********', user.role)

if (user) {
    // Устанавливаем фото пользователя
    imgUser.src = "data:image/png;base64," + user.foto;

    // Оборачиваем изображение в ссылку на профиль
    const link = document.createElement('a');
    link.href = `/user?id=${user._id}`;
    link.textContent = 'Current user ';
    imgUser.parentNode.insertBefore(link, imgUser);
    link.appendChild(imgUser);
} else {
    // Устанавливаем изображение по умолчанию
    imgUser.src = "/image/UndefinedUser.jpg";

    // Добавляем текст "Гость" или кнопку "Войти"
    const guestInfo = document.createElement('span');
    guestInfo.style.marginTop = '10px';
    guestInfo.style.textAlign = 'center';
    guestInfo.style.color = 'white';

    const guestText = document.createElement('span');
    guestText.textContent = '\u00A0User not defined';


    const loginButton = document.createElement('a');
    loginButton.href = '/login'; // предполагается, что у вас есть маршрут /login
    loginButton.textContent = 'Login';
    loginButton.style.display = 'inline-block';
    loginButton.style.padding = '6px 12px';
    loginButton.style.backgroundColor = '#007bff';
    loginButton.style.color = '#fff';
    loginButton.style.borderRadius = '4px';
    loginButton.style.textDecoration = 'none';

    guestInfo.appendChild(guestText);
    guestInfo.appendChild(loginButton);

    imgUser.parentNode.appendChild(guestInfo);
}
