const fs = require('fs');
const path = require('path');

const calculateButton = document.getElementById('calculate');
const calculateReceivedButton = document.getElementById('calculateReceived');

calculateButton.addEventListener("click", calculateResistance);
calculateReceivedButton.addEventListener("click", calculateReceivedResistance);

function calculateResistance() {
    const delta = document.getElementById('deltaField');
    const delta5 = document.getElementById('deltaField+5');
    const recommended = document.getElementById('recommended');
    const recommendedR2 = document.getElementById('recommendedAsSecond');
    const receivedResistance = document.getElementById('receivedResistance');
    const R4 = document.getElementById('field4');
    let R1 = document.getElementById('field1').value;
    let R2 = document.getElementById('field2').value;
    let R3 = document.getElementById('field3').value;
    let v0 = document.getElementById('v0').value;

    recommendedR2.value = "";
    receivedResistance.value = "";

    R1 = Number(R1);
    R2 = Number(R2);
    R3 = Number(R3);
    v0 = Number(v0);

    if (isNaN(R1) || isNaN(R2) || isNaN(R3) || isNaN(v0)) {
        alert('All fields must be string');
    } else {
        R4.value = ((R3 * 1000) / (v0 + ((R1 * 1000) / (R1 + R2)))) - R3;

        let compensation = ((R1 + R2 + R3) / 3) - Number(R4.value);
        delta.value = compensation;

        let compensation5 = compensation * 1.05;
        delta5.value = compensation5;

        fs.readFile(path.resolve(__dirname, 'resistors.json'), "utf8", function (error, data) {
            const resistors = JSON.parse(data);

            for (let i = 0; i < resistors.length; i++) {
                if (Number(resistors[i].nominal) == compensation.toFixed(2)) {
                    recommended.value = resistors[i].nominal;
                    return;
                } else {
                    if (Number(resistors[i].nominal) == compensation5.toFixed(2) || Number(resistors[i].nominal) > compensation.toFixed(2)) {
                        let R1Recommended = resistors[i].nominal;
                        recommended.value = R1Recommended;
                        let secondResistor = 1 / ((1 / compensation) - (1 / resistors[i].nominal));

                        fs.readFile(path.resolve(__dirname, "CompensationResistors.json"), "utf8", function (error, data) {
                            const CompensationResistors = JSON.parse(data);
                            for (let i = 0; i < CompensationResistors.length; i++) {
                                if (Number(CompensationResistors[i].nominal) > secondResistor) {
                                    let R2Recommended = CompensationResistors[i].nominal;
                                    recommendedR2.value = R2Recommended;
                                    receivedResistance.value = 1 / ((1 / R1Recommended) + (1 / R2Recommended));
                                    return;
                                }
                            }
                        });
                        return;
                    }
                }
            }
        });
    }
}

function calculateReceivedResistance() {
    const recommendedR1 = Number(document.getElementById('recommended').value);
    const recommendedR2 = Number(document.getElementById('recommendedAsSecond').value);
    const receivedResistance = document.getElementById('receivedResistance');

    receivedResistance.value = 1 / ((1 / recommendedR1) + (1 / recommendedR2));

}


