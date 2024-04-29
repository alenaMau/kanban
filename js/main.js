Vue.component('add-card', {
    template: `
    <div>
       <form @submit.prevent="addCard" class="form">
            <input v-model="title" name="title" placeholder="Заголовок"> 
            <input v-model="description" name="description" placeholder="Описание"> 
            <input type="date" v-model="deadline" name="deadline" placeholder="Дэдлайн"> 
            <button type="submit">Добавить</button>
        </form>
    </div>

 `,
    data() {
        return {
            title: "",
            description: "",
            deadline: "",
            cards: []
        }
    },
    methods: {
        addCard() {
            let cards = JSON.parse(localStorage.getItem('cards')) || [];
            const title = this.title;
            const description = this.description;
            const deadline = this.deadline;
            const dataCreation = new Date().toLocaleDateString()
            const lastEdited = new Date().toLocaleString()
            const card = {
                title,
                description,
                deadline,
                dataCreation,
                lastEdited
            }
            cards.push(card)
            localStorage.setItem('cards', JSON.stringify(cards))
            this.$emit("card-added", card)
            this.title = "";
            this.description = "";
            this.deadline = ""
        },
    }
})

Vue.component('card', {
    template: `
        <div>
            <div v-for="(card,index) in cards" class="card" >
               <p>Заголовок: {{card.title}} </p>
               <p>Описание: {{card.description}}</p>
               <p>Дэдлайн: {{card.deadline}}</p>
               <p>Дата создания: {{card.dataCreation}}</p>
               <p v-if="card.lastEdited">Последнее редактирование: {{card.lastEdited}}</p>
               <div class="row">
                     <button @click="clickDelete(index)">Удалить</button>
                     <button @click="handleClickWorks(card)">Перенести в работу -></button>
                     <button @click="editCard(card)">Редактирование</button>
                </div>
            </div>
        </div>
    `,
    props: {
        cards: {
            type: Array,
        }
    },
    methods: {
        editCard(card) {
            this.$emit('button-edit', card, 'cards');
        },
        clickDelete(index) {
            this.$emit('button-delete', index);
        },
        handleClickWorks(card) {
            this.$emit('button-clicked', card);
        }
    }
});
Vue.component('works', {
    template: `
        <div>
            <div v-for="work in works" class="card">
               <p>Заголовок: {{work.title}} </p>
               <p>Описание: {{work.description}}</p>
               <p>Дэдлайн: {{work.deadline}}</p>
               <p>Дата создания: {{work.dataCreation}}</p>
               <p v-if="work.lastEdited">Последнее редактирование: {{work.lastEdited}}</p>
               <div class="row">
                    <button @click="handleClick(work)">Перенести в тест-></button>
                    <button @click="editItem(work)">Редактирование</button>
               </div>
            </div> 
        </div>
    `,
    props: {
        works: {
            type: Array
        },
    },
    methods: {
        handleClick(work) {
            this.$emit('button-test', work);
        },
        editItem(work) {
            this.$emit('button-edit', work, 'works');
        },
    }

});

Vue.component('test', {
    template: `
        <div>
            <div v-for="test in tests" class="card">
               <p>Заголовок: {{test.title}} </p>
               <p>Описание: {{test.description}}</p>
               <p>Дэдлайн: {{test.deadline}}</p>
               <p>Дата создания: {{test.dataCreation}}</p>
               <p v-if="test.lastEdited">Последнее редактирование: {{test.lastEdited}}</p>
               <div class="row">
                    <button @click="clickWork(test)"><- Перенести в работу</button>
                    <button @click="handleClick(test)">Перенести в Выполнненые -></button>
                    <button @click="editItem(test)">Редактирование</button>
                </div>
            </div> 
        </div>
    `,
    props: {
        tests: {
            type: Array
        }
    },
    methods: {
        editItem(test) {
            this.$emit('button-edit', test, 'tests');
        },
        clickWork(test) {
            this.$emit('button-click-work', test);
        },
        handleClick(test) {
            this.$emit('button-completed', test)
        }
    }
});
Vue.component('completed', {
    template: `    
        <div>
            <div v-for="finish in finished" class="card">
            <h2 v-if="realTime > new Date(finish.deadline)">Карточка не выполнена в срок</h2>
            <h2 v-else>Карточка выполнена в срок</h2>
               <p>Заголовок: {{finish.title}} </p>
               <p>Описание: {{finish.description}}</p>
               <p>Дэдлайн: {{finish.deadline}}</p>
               <p>Дата создания: {{finish.dataCreation}}</p>
            </div> 
        </div>
    `,
    props: {
        finished: {
            type: Array
        },
    },
    data() {
        return {
            realTime: new Date()
        };
    },
});

Vue.component('edit-card', {
    template: `    
        <div>
            <div class="edit">
                <p>Редактирование</p>
                <input type="text" v-model="item.title" placeholder="Заголовок">
                <input v-model="item.description" placeholder="Описание">
                <input type="date" v-model="item.deadline" placeholder="Дэдлайн">
                <button @click="saveChanges">Сохранить изменения</button>
                <p v-if="item.lastEdited">Последнее редактирование: {{ item.lastEdited }}</p>
            </div> 
        </div>
    `,
    props: {
        item: {
            type: Object,
            required: true
        },
        itemType: {
            type: String,
            required: true
        }
    },
    methods: {
        saveChanges() {
            this.$emit('save-changes', this.item);
        }
    }
});

let app = new Vue({
    el: '#app',
    data: {
        cards: [],
        tests: [],
        works: [],
        finished: [],
        editingItem: null,
        editingItemType: null,
    },
    methods: {
        editItem(item, itemType) {
            this.editingItem = Object.assign({}, item, { lastEdited: new Date().toLocaleString() });
            this.editingItemType = itemType;
        },
        saveEditedItem(editedItem) {
            editedItem.lastEdited = new Date().toLocaleString();
            const itemType = this.editingItemType;
            const index = this[itemType].findIndex(item => item.id === editedItem.id);
            if (index !== -1) {
                this.$set(this[itemType], index, editedItem);
                this.saveArrayToLocalStorage(itemType, this[itemType]);
            }
            this.editingItem = null;
            this.editingItemType = null;
        },
        deleteCard(index) {
            console.log(index)
            this.cards.splice(index, 1);
            const storedCards = JSON.parse(localStorage.getItem('cards')) || [];
            storedCards.splice(index, 1);
            localStorage.setItem('cards', JSON.stringify(storedCards));
        },
        addCardToList(card) {
            this.cards.push(card);
        },
        addWorks(card) {
            this.works.push(card);
            this.removeCardFromArray(card, this.cards);
            this.removeCardFromArray(card, this.tests);
            this.saveArrayToLocalStorage('works', this.works);
        },
        redirectionWorks(test) {
            this.works.push(test);
            this.removeCardFromArray(test, this.tests);
            this.saveArrayToLocalStorage('works', this.works);
        },
        addCompleted(work) {
            this.finished.push(work);
            this.removeCardFromArray(work, this.cards);
            this.removeCardFromArray(work, this.tests);
            this.saveArrayToLocalStorage('finished', this.finished);
        },
        handleButtonClicked(work) {
            this.tests.push(work);
            this.removeCardFromArray(work, this.cards);
            this.removeCardFromArray(work, this.works);
            this.saveArrayToLocalStorage('tests', this.tests);
        },
        removeCardFromArray(card, array) {
            const index = array.findIndex(item => item.title === card.title && item.deadline === card.deadline);
            if (index !== -1) {
                array.splice(index, 1);
                this.saveArrayToLocalStorage('cards', this.cards);
                this.saveArrayToLocalStorage('works', this.works);
                this.saveArrayToLocalStorage('tests', this.tests);
            }
        },
        saveArrayToLocalStorage(key, array) {
            localStorage.setItem(key, JSON.stringify(array));
        },
    },
    created() {
        this.works = JSON.parse(localStorage.getItem('works')) || [];
        this.cards = JSON.parse(localStorage.getItem('cards')) || [];
        this.tests = JSON.parse(localStorage.getItem('tests')) || [];
        this.finished = JSON.parse(localStorage.getItem('finished')) || [];
    }
})
