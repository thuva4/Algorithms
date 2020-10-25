function toggle_language(column_idx) {

    document.querySelectorAll('table > thead > tr').forEach(th_element => {
        const th_array = th_element.querySelectorAll('th');
        th_array[column_idx].classList.toggle('hidden');
    });

    document.querySelectorAll('table > tbody > tr').forEach(tr_element => {
        const td_array = tr_element.querySelectorAll('td');
        td_array[column_idx].classList.toggle('hidden');
    });
}

const h2_element = document.getElementById('implemented-algorithms-with-languages');
var i = 1;

document.querySelectorAll('table > thead > tr > th').forEach(th_element => {
    const language = th_element.textContent;
    if (language != 'Language') {
        var language_toggle = document.createElement('input');
        language_toggle.setAttribute('type', 'button');
        language_toggle.setAttribute('id', language);
        language_toggle.setAttribute('onclick', 'toggle_language(' + i++ + ');');
        language_toggle.setAttribute('value', 'Show/Hide ' + language);
        h2_element.appendChild(language_toggle);
    }
});

document.querySelectorAll('table > tbody > tr > td').forEach(td_element => {
    const content = td_element.textContent;
    if (content == ':+1:') {
        td_element.innerHTML = '&#128077;';
    }
});
