ymaps.ready(init);

// 55.7 37.6
// 59.9 30.3
// 59.2 39.9

function init() {
    var myMap = new ymaps.Map('map', {
            center: [55.76, 37.64],
            zoom: 1
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 32,
            clusterDisableClickZoom: true
        });

    // Чтобы задать опции одиночным объектам и кластерам,
    // обратимся к дочерним коллекциям ObjectManager.
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);

    var myCoords = [[55.7, 37.6],
                [59.9, 30.3],
                [59.2, 39.9]];
    objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    myMap.geoObjects.add(objectManager);

    var currentId = 0;
    for (var i = 0; i < myCoords.length; i++) {
        objectManager.add({
            type: 'Feature',
            id: currentId++,
            geometry: {
                type: 'Point',
                coordinates: [myCoords[i][0], myCoords[i][1]]
            },
            properties: {
                hintContent: 'Содержание всплывающей подсказки',
                balloonContent: 'Содержание балуна'
            }
        });
    }

    console.log(objectManager.objects);

}
