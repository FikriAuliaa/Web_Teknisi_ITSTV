# Website Peminjaman ITS TV

## Frontend URL
```
https://peminjaman-gemilang.netlify.app/
```
## Backend URL
```
https://peminjaman-barang-itstv.vercel.app/
```

## Admin Credentials
```
username : admin

password : admin

role : Admin
```
### Fitur Admin
- Menambah, edit, dan hapus barang
- Menambah, edit, dan hapus teknisi
- Membuat Invoice dari peminjaman

## Crew Credentials
```
username : crew

password : crew

role : Crew
```

### Fitur Crew
- Meminjam dan mengembalikan barang
- Melihat list barang yang tersedia
  
## **Data Models**
```bash
enum Role {
	'Admin',
	'Operator'
}

type User = {
	username: string;
	password: string;
	role: Role;
}

type Items = {
    pic: string;
	name: string;
	amount: string;
	condition: string;
	created_at: Date;
}

type BorrowItems = {
	item_name: string;
	amount: string;
	borrow_date: Date;
	return_date: Date;
	borrower_name: string;
	officer_name: string;
}

type Operators = {
    name: string;
    NoTelp: string;
    Email: string;
}
```

### Technologies Used

- **Frontend**: HTML, CSS, TypeScript, Vue.js, Netlify
- **Backend**: Node.js, Express.js, Vercell
- **Database**: MongoDB
- **Version Control**: Git, GitHub

## Installation (For Development)

1. Clone the repository:
    ```bash
    git clone https://github.com/FikriAuliaa/Web_Teknisi_ITSTV.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Web_Teknisi_ITSTV
    ```

### BackEnd

3. Navigate to the BackEnd directory:
    ```bash
    cd server
    ```
4. Install dependencies:
    ```bash
    npm install
    ```
5. Set up the database and configure environment variables. Make an .env file in /server directory
    ```bash
    DATABASE_URI=mongodb+srv://fikriaulia:DepotTaria14@cluster0.xkzlj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
    JWT_SECRET=1t5tv3ur3k4
    PORT=5000
    ```
6. Start the development server:
    ```bash
    npm run start:dev
    ```
    
### FrontEnd

3. Navigate to the FrontEnd directory:
    ```bash
    cd client
    ```
4. Install dependencies:
    ```bash
    npm install
    ```
5. Start the development server:
    ```bash
    npm run dev 
    ```
