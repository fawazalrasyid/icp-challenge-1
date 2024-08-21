import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

interface Bookmark {
  id: string;
  title: string;
  url: string;
  description?: string;
}

@customElement("azle-app")
export class AzleApp extends LitElement {
  @property({ type: Array })
  bookmarks: Bookmark[] = [];

  @property({ type: String })
  title = "";

  @property({ type: String })
  url = "";

  @property({ type: String })
  description = "";

  constructor() {
    super();
    this.getBookmarks();
  }

  async getBookmarks(): Promise<void> {
    try {
      const response = await fetch("/bookmarks");
      const data = await response.json();
      this.bookmarks = data;
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  }

  async addBookmark(): Promise<void> {
    const newBookmark: Bookmark = {
      id: "",
      title: this.title,
      url: this.url,
      description: this.description,
    };

    try {
      const response = await fetch("/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBookmark),
      });

      const data = await response.json();
      this.bookmarks = [...this.bookmarks, data];
      this.clearForm();
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  }

  async deleteBookmark(id: string): Promise<void> {
    try {
      await fetch(`/bookmark/${id}`, {
        method: "DELETE",
      });

      this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id);
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  }

  clearForm(): void {
    this.title = "";
    this.url = "";
    this.description = "";
  }

  render(): any {
    return html`
      <h1>Link Bookmark</h1>

      <div>
        <label>Title:</label>
        <input
          type="text"
          .value=${this.title}
          @input=${(e: any) => (this.title = e.target.value)}
        />
      </div>

      <div>
        <label>URL:</label>
        <input
          type="text"
          .value=${this.url}
          @input=${(e: any) => (this.url = e.target.value)}
        />
      </div>

      <div>
        <label>Description:</label>
        <input
          type="text"
          .value=${this.description}
          @input=${(e: any) => (this.description = e.target.value)}
        />
      </div>

      <button @click=${this.addBookmark}>Add Bookmark</button>

      <h2>Bookmark List</h2>
      <ul>
        ${this.bookmarks.map(
          (bookmark) => html`
            <li>
              <strong>${bookmark.title}</strong> -
              <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
              <p>${bookmark.description}</p>
              <button @click=${() => this.deleteBookmark(bookmark.id)}>
                Delete
              </button>
            </li>
          `
        )}
      </ul>
    `;
  }
}
