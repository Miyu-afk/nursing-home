const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const cardContainer = document.getElementById('card-container');
const startBtn = document.getElementById('start-matching');
const addBtn = document.getElementById('add-home');
const likedSection = document.getElementById('liked-section');
const likedList = document.getElementById('liked-list');
const showLikedBtn =document.getElementById('show-liked');
const backToMatchBtn = document.getElementById('back-to-match'); 
const Modal = document.getElementById('exampleModal');
const addHomeModal = new bootstrap.Modal(Modal);
const matchSection = document.getElementById('match');
const likedHomes = [];


menuToggle.addEventListener('click', ()=>{
  navMenu.classList.toggle('active');
});

const homes= [
  { name: "さくらホーム", area:"徳島県", description: "緑豊かでアットホームな施設です"},
  { name: "ひまわりのさと", area:"徳島県", description: "大通りに面しており、ご家族のご来訪もしやすい施設です。"},
  { name: "もみじのやかた", area:"徳島県", description: "川沿いに面しており、秋には室内から紅葉をお楽しみいただけます"}
];


addBtn.addEventListener('click', () => {
  const name = document.getElementById('home-name').value;
  const area = document.getElementById('home-area').value;
  const description = document.getElementById('home-description').value;

  if (name && area && description){
    homes.push({ name, area, description });
    alert("施設を追加しました。");

    document.getElementById('home-name').value='';
    document.getElementById('home-area').value='';
    document.getElementById('home-description').value='';
    addHomeModal.hide();
  }else{
    alert("すべての項目を入力してください。");
  }
});

startBtn.addEventListener('click', () => {
  const selectedArea = document.getElementById('area-select').value;
  cardContainer.innerHTML = '';

  const filteredHomes = selectedArea === 'すべて'
  ?homes.slice()
  :homes.filter(home => home.area === selectedArea); 

  if(filteredHomes.length === 0 ){
    const noMatchMsg = document.createElement('p');
    noMatchMsg.textContent ='一致する施設はありません';
    noMatchMsg.style.textAlign = 'center';
    noMatchMsg.style.padding ='20px';
    cardContainer.appendChild(noMatchMsg);
    return;
  }

  filteredHomes.reverse().forEach((home) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
    <h3>${home.name}</h3>
    <p>${home.area}</p>
    <p>${home.description}</p>
    `;
    cardContainer.appendChild(card);

    let offsetX = 0 ;
    let startX = 0;

    const onMouseMove = (e) => {
      offsetX = e.clientX - startX;
      card.style.transform = `translateX(${offsetX}px) rotate(${offsetX*0.05}deg)`;
    };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        if (offsetX > 100){
          console.log('いいね', home.name);
          card.style.transform = 'translateX(1000px)';
          card.style.opacity = 0;
          likedHomes.push(home);
        }else if(offsetX < -100){
          console.log('次へ', home.name);
          card.style.transform = 'translateX(-1000px)';
          card.style.opacity = 0;
        }else{
          card.style.transform = '';
        }
      };

      card.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });

      card.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  document.addEventListener('touchmove', onTouchMove, { passive:false});
  document.addEventListener('touchend', onTouchEnd);
});

const onTouchMove = (e) => {
  e.preventDefault();
  offsetX = e.touches[0].clientX - startX;
  card.style.transform = `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)`;
};

const onTouchEnd = () => {
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);

  if (offsetX > 100) {
    console.log('いいね', home.name);
    card.style.transform = 'translateX(1000px)';
    card.style.opacity = 0;
    likedHomes.push(home);
  } else if (offsetX < -100) {
    console.log('次へ', home.name);
    card.style.transform = 'translateX(-1000px)';
    card.style.opacity = 0;
  } else {
    card.style.transform = '';
  }
};
  });
});

showLikedBtn.addEventListener('click', () => {
  likedList.innerHTML = '';

  if(likedHomes.length === 0){
    likedList.innerHTML='<p>まだいいねした施設はありません。</p>';
  }else {
    likedHomes.forEach(home => {
      const likedCard = document.createElement('div');
      likedCard.classList.add('card');
      likedCard.innerHTML=`
      <h3>${home.name}</h3>
      <p>${home.area}</p>
      <p>${home.description}</p>
      `;
      likedList.appendChild(likedCard);
    });
  }
  likedSection.style.display ='block';
  matchSection.style.display ='none';
  showLikedBtn.style.display = 'none';
})

backToMatchBtn.addEventListener('click' , () => {
  likedSection.style.display = 'none';
  matchSection.style.display = 'block';
  showLikedBtn.style.display = 'inline-block';
  cardContainer.innerHTML='';
});