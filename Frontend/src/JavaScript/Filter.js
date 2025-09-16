export function changeByClick() {
    var FilterBySubject = document.querySelector('.FilterBySubject');
    var down = document.querySelector('.down');
    down.classList.toggle('rotateElement')
    FilterBySubject.classList.toggle('changeHeight');
}