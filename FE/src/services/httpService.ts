export class HttpService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "http://127.0.0.1:5001/project-management-f27b0/us-central1";
  }

  // Hàm dùng để xử lý response
  private async handleResponse(response: Response) {
    return response.json();
  }

  // Phương thức GET
  public async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return this.handleResponse(response);
  }

  // Phương thức POST
  public async post<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  // Phương thức PUT
  public async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  }

  // Phương thức DELETE
  public async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return this.handleResponse(response);
  }
}
