import Model from './model.js';

const View = {
  formInputBook: () => `
        <form>
            <input type="text" id="title_input" name="title" placeholder="Title" />
            <input type="text"  id="author_input" name="author" placeholder="Author" />
            <input type="number" value="2021" id="year_input" name="year" placeholder="year"/>

            <div class="checkbox">
                <input id="complete_chkbox" type="checkbox"/>
                <label for="complete_chkbox">complete</label>
            </div>
            
            <div class="action">
                <small></small>
                <button>save</button>
            </div>
        </form>
    `,
  book: ({
    id, title, author, year, isComplete,
  }) => ` <div class="book" id="${id}" data-iscomplete="${isComplete}">
        <div class="info">
            <p class="title">${Model.cutText(title)}</p>
            <p class="author">${Model.cutText(author)}</p>
            <p class="year">${year}</p>
        </div>
        
        <div class="action">
            <div class="tooltip_btn_complete">${isComplete ? 'click to uncomplete' : 'click to complete'}</div>
            <div class="tooltip_btn_not_complete">delete</div>
            <button class="btn_complete">&#10004;</button>
            <button class="btn_delete">&times;</button>
        </div>
    </div>`,
  deletePopup: ({ title }) => `
            <div class="delete_popup">
                <p class="title">${Model.cutText(title)}</p>
                <p class="delete">Dihapus</p>
            </div>
        `,
};

export default View;
