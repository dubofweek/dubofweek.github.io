function initRemovers() {
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.remover__trigger');

    // Закрываем все открытые дропдауны
    document.querySelectorAll('.remover__dropdown--open').forEach(function (dropdown) {
      if (!trigger || dropdown !== trigger.closest('.remover').querySelector('.remover__dropdown')) {
        dropdown.classList.remove('remover__dropdown--open');
      }
    });

    // Открываем/закрываем нужный
    if (trigger) {
      const dropdown = trigger.closest('.remover').querySelector('.remover__dropdown');
      dropdown.classList.toggle('remover__dropdown--open');
    }
  });
}

document.addEventListener('DOMContentLoaded', initRemovers);