function PhuToiThieu(input) {
    var check;
    var kq = '';
    /**
     * Kiểm tra s2 trong s1
     * @param {*} s1 
     * @param {*} s2 
     */
    function include(s1, s2) {
        var arrS2 = [...s2.split('')];
        for (var i = 0; i < s2.length; i++)
            if (!s1.includes(arrS2[i]))
                return false;
        return true;
    }

    var promise = new Promise((resolve) => {
        resolve(input.split(';').reduce((a, b) => {
            return a.push([...b.split('®')]) && a;
        }, []))
    })

    function checkPhuThuocHam(x0, f, check) {
        for (var i = 0; i < f.length; i++) {
            if (include(x0, f[i][0]) && !check.includes(i)) {
                check.push(i);
                return f[i][1];
            }
        }
    }

    function decToBin(a) {
        var s = '';
        while (a > 0) {
            s = (a % 2) + s;
            a /= 2;
            a = parseInt(a);
        }
        return s;
    }

    function hamSinh(a) {
        var arr = [];
        for (var i = 1; i < 2 ** a - 1; i++) {
            var res = decToBin(i);
            while (res.length < a)
                res = 0 + res;
            arr.push(res);
        }
        return arr;
    }

    promise.then(a => {
            a.forEach((element, index) => {
                if (element[0].length > 1) {
                    console.log();
                    kq += `\nXét ${element[0]}->${element[1]}\n`;
                    console.log(`Xét ${element[0]}->${element[1]}`);
                    var allTH = hamSinh(element[0].length);
                    if (!allTH.find(bit => {
                            var baoDong = '',
                                baoDongFirst;
                            var res;
                            for (var i = 0; i < bit.length; i++)
                                baoDong += bit[i] === '1' ? element[0][i] : '';
                            baoDongFirst = baoDong;
                            check = [];
                            while (true) {
                                res = checkPhuThuocHam(baoDong, a, check);
                                if (!res)
                                    break;
                                baoDong += res;
                                baoDong = Array.from(new Set(baoDong.split(''))).join('');
                            }
                            kq += `${baoDongFirst}+ = ${baoDong}\n`;
                            console.log(`${baoDongFirst}+ = ${baoDong}`);
                            if (include(baoDong, element[1])) {
                                kq += `Chứa ${element[1]} -> thay ${element[0]}->${element[1]} bằng ${baoDongFirst}->${element[1]}\n`;
                                console.log(`Chứa ${element[1]} -> thay ${element[0]}->${element[1]} bằng ${baoDongFirst}->${element[1]}`);
                                a[index] = [baoDongFirst, element[1]];
                                return true;
                            }
                        })) {
                        kq += `Không chứa ${element[1]} -> không dư thừa vế trái\n\n`;
                        console.log(`Không chứa ${element[1]} -> không dư thừa vế trái`);
                    }
                }
            })
            document.querySelector('.b1').innerText = kq;
            kq = '';
            return new Promise((resolve) => resolve(a));
        })
        .then(a => {
            a.forEach(element => {
                if (element[1].length > 1)
                    element[1].split('').forEach(arr =>
                        a.push([element[0], arr]))
            })
            a = a.filter(a => a[1].length === 1);
            var res = a.reduce((a, b) =>
                a === '' ? a + `${b[0]}->${b[1]}` : a + `; ${b[0]}->${b[1]}`, '');
            console.log();
            kq += `\nF; = {${res}}\n\n`;
            console.log(`F = {${res}}`);
            document.querySelector('.b2').innerText = kq;
            kq = '';
            return new Promise((resolve) => resolve(a));
        })
        .then(a => {
            for (var i = 0; i < a.length; i++) {
                console.log();
                kq += `\nGiả sử loại ${a[i][0]}->${a[i][1]}\n`
                console.log(`Giả sử loại ${a[i][0]}->${a[i][1]}`);
                var f = a.filter((a, j) => j !== i);
                var fp = f.reduce((a, b) =>
                    a === '' ? a + `${b[0]}->${b[1]}` : a + `; ${b[0]}->${b[1]}`, '');
                kq += `F' = {${fp}}\n`;
                console.log(`F' = {${fp}}`);
                var baoDong = a[i][0];
                check = [];
                while (true) {
                    res = checkPhuThuocHam(baoDong, f, check);
                    if (!res)
                        break;
                    baoDong += res;
                    baoDong = Array.from(new Set(baoDong.split(''))).join('');
                }
                kq += `${a[i][0]}+ = ${baoDong}\n`;
                console.log(`${a[i][0]}+ = ${baoDong}`);
                if (include(baoDong, a[i][1])) {
                    kq += `Chứa ${a[i][1]} nên loại\n`;
                    console.log(`Chứa ${a[i][1]} nên loại`);
                    a.splice(i, 1);
                    i--;
                } else {
                    kq += `Không chứa ${a[i][1]} -> Không loại được ${a[i][0]}->${a[i][1]}\n`;
                    console.log(`Không chứa ${a[i][1]} -> Không loại được ${a[i][0]}->${a[i][1]}`)
                }
            }
            var fp = a.reduce((a, b) =>
                a === '' ? a + `${b[0]}->${b[1]}` : a + `; ${b[0]}->${b[1]}`, '');
            kq += `\nVậy Ftt = {${fp}}`;
            document.querySelector('.b3').innerText = kq;
            kq = '';
            return new Promise(res => res(kq));
        });
}

// AB®C;C®A;BC®D;ACD®B;D®EG;BE®C;CG®BD;CE®AG

function handlerInput(value) {
    const specialCharacters = '®';
    var result = '';
    for (var i = 0; i < value.length; i++)
        if (value[i] === ' ')
            continue;
        else if ((value[i].toUpperCase() >= 'A' && value[i].toUpperCase() <= 'Z') || value[i] === ';')
            result += value[i].toUpperCase();
        else if (value[i] === ',')
            result += ';';
        else
            result += specialCharacters;
    return result;
}

var submitBtn = document.querySelector('button');
submitBtn.onclick = () => {
    var inputElement = document.querySelector('input');
    if (inputElement.value)
        PhuToiThieu(handlerInput(inputElement.value));
}
