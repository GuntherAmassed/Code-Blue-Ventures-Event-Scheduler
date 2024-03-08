
(() => {
    let timer;
    const inputs = document.getElementsByTagName('input');
    const ExIconInput = document.getElementsByClassName('ExIconForInputs');
    const Labels = document.getElementsByTagName('label');
    const LabelP = document.querySelectorAll('.Label-P');
    const errors = document.querySelectorAll('.Error-Message');
    const PassWordHidden = document.querySelector('.PassWord-Hidden-Class');
    console.log(errors);
    console.log(inputs.length);
    for (let i = 0; i < inputs.length; i++) {
        ExIconInput[i].addEventListener('click', () => {
            inputs[i].value = ''
            ExIconInput[i].classList.toggle('hidden');
            if (LabelP !== undefined) {
                if (inputs[i].placeholder === '') {
                    LabelP[i].classList.remove("go-up-P");
                }
            }
            console.log(inputs[i].type)
            if (PassWordHidden !== undefined && inputs[i].type === 'password') {
                PassWordHidden.classList.add('hidden')
            }

        })
        inputs[i].addEventListener('click', (e) => {
            errors.forEach(e => e.style.display = 'none')
            if (LabelP !== undefined) {
                if (inputs[i].placeholder === '' && inputs[i].value === '') {
                    LabelP[i].classList.remove("go-up-P");
                }
            }
        })
        inputs[i].addEventListener('keypress', () => {
            if (LabelP !== undefined) {
                LabelP[i].classList.add('go-up-P')
            }

            window.clearTimeout(timer);
            inputs[i].style.color = 'gray'
        })
        inputs[i].addEventListener('keyup', (e) => {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                inputs[i].style.color = 'white'
                Labels[i].style.color = '#929BA3'
                if (e.key !== 'Backspace') {
                    ExIconInput[i].classList.remove('hidden');
                }
                if (inputs[i].value === '') {
                    if (LabelP !== undefined) {
                        LabelP[i].classList.remove("go-up-P");
                    }
                }
                if (PassWordHidden !== undefined && inputs[i].type === 'password') {
                    PassWordHidden.classList.remove('hidden')
                }
            }, 200);
        })
        inputs[i].addEventListener('input', (e) => {
            console.log(e);
            if (LabelP !== undefined) {
                LabelP[i].classList.add('go-up-P')
            }
            Labels[i].style.color = '#009AFE'
            if (inputs[i].value === '' && e.inputType === 'deleteContentBackward') {
                ExIconInput[i].classList.add('hidden');
                if (PassWordHidden !== undefined && inputs[i].type === 'password') {
                    PassWordHidden.classList.add('hidden')
                }
            }
            if (inputs[i].value !== '') {
                inputs[i].style.color = 'white'
                Labels[i].style.color = '#929BA3'
                if (LabelP !== undefined) {
                    LabelP[i].classList.add('go-up-P')
                }
                ExIconInput[i].classList.remove('hidden');
                if (PassWordHidden !== undefined && inputs[i].type === 'password') {
                    PassWordHidden.classList.remove('hidden')
                }
            }
        })
        if (inputs[i].value !== '') {
            inputs[i].style.color = 'white'
            Labels[i].style.color = '#929BA3'
            if (LabelP !== undefined) {
                LabelP[i].classList.add('go-up-P')
            }
            ExIconInput[i].classList.remove('hidden');
            if (PassWordHidden !== undefined && inputs[i].type === 'password') {
                PassWordHidden.classList.remove('hidden')
            }
        }
    }
})()
