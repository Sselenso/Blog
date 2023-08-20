(function() {
  'use strict';

  const posts = [];

  const TITLE_VALIDATION_LIMIT = 100;
  const TEXT_VALIDATION_LIMIT = 200;

  const postTitleInputNode = document.querySelector('.js-post-title-input');
  const postTextInputNode = document.querySelector('.js-post-text-input');
  const newPostBtnNode = document.querySelector('.js-new-post-btn');
  const postsNode = document.querySelector('.js-posts');
  const validationMessage = document.getElementById('validationMessage');

  if (!postTitleInputNode || !postTextInputNode || !newPostBtnNode || !postsNode || !validationMessage) {
    console.error('Failed to find required elements.');
    return;
  }

  newPostBtnNode.addEventListener('click', () => {
    const postFromUser = getPostFromUser();
    if (postFromUser) {
      addPost(postFromUser);
      renderPosts();
      clearInputs();
      postTitleInputNode.focus();
      hideValidationMessage();
    }
  });

  postTitleInputNode.addEventListener('input', validation);
  postTextInputNode.addEventListener('input', validation);

  function validation() {
    const titleLen = postTitleInputNode.value.length;
    const textLen = postTextInputNode.value.length;

    if (titleLen === 0 || textLen === 0) {
      showValidationMessage("Заголовок и текст не могут быть пустыми");
      disableNewPostBtn();
      return;
    }

    if (titleLen > TITLE_VALIDATION_LIMIT) {
      showValidationMessage(`Длина заголовка не должна превышать ${TITLE_VALIDATION_LIMIT} символов`);
      disableNewPostBtn();
      return;
    }

    if (textLen > TEXT_VALIDATION_LIMIT) {
      showValidationMessage(`Длина текста не должна превышать ${TEXT_VALIDATION_LIMIT} символов`);
      disableNewPostBtn();
      return;
    }

    hideValidationMessage();
    enableNewPostBtn();
  }

  function showValidationMessage(message) {
    validationMessage.innerText = message;
    validationMessage.classList.remove("validation__message-hidden");
  }

  function hideValidationMessage() {
    validationMessage.classList.add("validation__message-hidden");
  }

  function disableNewPostBtn() {
    newPostBtnNode.disabled = true;
  }

  function enableNewPostBtn() {
    newPostBtnNode.disabled = false;
  }

  function getPostFromUser() {
    const title = postTitleInputNode.value.trim();
    const text = postTextInputNode.value.trim();

    if (title.length === 0 || text.length === 0) {
      return null; // Не добавляем пустые посты
    }

    return { title, text };
  }

  function addPost({ title, text }) {
    const currentDate = new Date();
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const dt = `${currentDate.getHours()}:${minutes} ${currentDate.getDate()}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;
    posts.push({ dt, title, text });
  }

  function renderPosts() {
    postsNode.innerHTML = '';
  
    posts.forEach((post, index) => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');
      postElement.innerHTML = `
        <div class="post__date">${post.dt}</div>
        <h3 class="post__title">${post.title}</h3>
        <div class="post__text">${post.text}</div>
        <div class="post__actions">
          <button class="post__actions-btn">...</button>
          <div class="post__context-menu" id="contextMenu${index}">
            <div class="post__context">
              <button class="post__context-menu-item delete-post-btn">Удалить</button>
              <button class="post__context-menu-item edit-post-btn">Редактировать</button>
            </div>
          </div>
        </div>
      `;
      postsNode.appendChild(postElement);
    });
  
    const postActionsBtns = document.querySelectorAll('.post__actions-btn');
    postActionsBtns.forEach((btn, index) => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const contextMenu = document.getElementById(`contextMenu${index}`);
        contextMenu.style.display = (contextMenu.style.display === 'block') ? 'none' : 'block';
      });
    });
  
    const deletePostBtns = document.querySelectorAll('.delete-post-btn');
    deletePostBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        deletePost(index);
        renderPosts();
      });
    });
  
    const editPostBtns = document.querySelectorAll('.edit-post-btn');
    editPostBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        editPost(index);
      });
    });
  
    document.addEventListener('click', (event) => {
      const contextMenus = document.querySelectorAll('.post__context-menu');
      contextMenus.forEach(menu => {
        if (!menu.contains(event.target)) {
          menu.style.display = 'none';
        }
      });
    });
  }
  
  function deletePost(index) {
    posts.splice(index, 1);
  }
  
  let editPostIndex = -1;
  
  function editPost(index) {
    const post = posts[index];
    postTitleInputNode.value = post.title;
    postTextInputNode.value = post.text;
    editPostIndex = index;
    postTitleInputNode.focus();
  }
  
  function clearInputs() {
    postTitleInputNode.value = '';
    postTextInputNode.value = '';
  }
  
  renderPosts();
})();
