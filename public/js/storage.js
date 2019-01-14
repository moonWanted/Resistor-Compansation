(function () {
    const fs = require('fs');
    const path = require('path');

    const findButton = document.getElementById('findStorage');
    const insertButton = document.getElementById('insertStorage');
    const deleteButton = document.getElementById('deleteFromStorage');

    findButton.addEventListener('click', findAllNominals);
    insertButton.addEventListener('click', insertOneNominal);
    deleteButton.addEventListener('click', deleteOneNominal);

    function findAllNominals() {
        $(".category-list").empty();
        fs.readFile(path.resolve(__dirname, 'resistors.json'), "utf8", function (error, data) {
            const resistors = JSON.parse(data);
            for (let i = 0; i < resistors.length; i++) {
                $(".category-list").append("<li>" + resistors[i].nominal + "</li>");
            }
        });
    };

    function insertOneNominal() {
        $(".category-list").empty();
        let newNominal;
        newNominal = Number($('#insertField').val());
        fs.readFile(path.resolve(__dirname, 'resistors.json'), "utf8", function (error, data) {
            const resistors = JSON.parse(data);
            if (!isNaN(newNominal) && newNominal != 0) {
                for (let i = 0; i < resistors.length; i++) {
                    if (resistors[i].nominal == newNominal) {
                        alert("Such resistor is already in storage");
                        return;
                    }
                    if (resistors[i].nominal > newNominal) {
                        resistors.splice(i, 0, {"nominal": newNominal});
                        let json = JSON.stringify(resistors);
                        fs.writeFile(path.resolve(__dirname, 'resistors.json'), json, 'utf8', function (error) {
                            if (error) {
                                console.log('Failed to add resistor');
                            } else {
                                alert('Resistor has been add');
                            }
                        });
                        return;
                    }
                }
            } else {
                alert('All fields must be string');
            }
            ;
        });
    };

    function deleteOneNominal() {
        $(".category-list").empty();
        let deleteNominal;
        deleteNominal = Number($('#deleteField').val());
        fs.readFile(path.resolve(__dirname, 'resistors.json'), "utf8", function (error, data) {
            const resistors = JSON.parse(data);
            if (!isNaN(deleteNominal) && deleteNominal != 0) {
                for (let i = 0; i < resistors.length; i++) {
                    if (resistors[i].nominal == deleteNominal) {
                        resistors.splice(i, 1);
                        let json = JSON.stringify(resistors);
                        fs.writeFile(path.resolve(__dirname, 'resistors.json'), json, 'utf8', function (error) {
                            if (error) {
                                console.log('Failed to add resistor');
                            } else {
                                alert('Resistor has been deleted');
                            }
                        });
                        return;
                    }
                }
                alert('No such resistor in storage');
            } else {
                alert('All fields must be string');
            }
            ;
        });
    };
}());

