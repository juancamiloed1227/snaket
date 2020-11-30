package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"database/sql"

    _ "github.com/lib/pq"
)

func main() {

	// this serves the index page to test the game on
	http.HandleFunc("/", mainHandler)

	// this gets the libraries for your game
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets"))))

	// listen and serve
	log.Fatal(http.ListenAndServe(":8080", nil))

	// Connect to the "bank" database.
    db, err := sql.Open("postgres", "postgresql://maxroach@localhost:26257/snaket?sslmode=disable")
    if err != nil {
        log.Fatal("error connecting to the database: ", err)
    }

    // Create the "accounts" table.
    if _, err := db.Exec(
        "CREATE TABLE IF NOT EXISTS juegos (idJuego int NOT NULL PRIMARY KEY auto_increment, puntaje INT NOT NULL, fechaJuego TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)"); err != nil {
        log.Fatal(err)
    }

    // Insert two rows into the "accounts" table.
    if _, err := db.Exec(
        "INSERT INTO juegos (puntaje) VALUES (15), (8)"); err != nil {
        log.Fatal(err)
    }

    // Print out the balances.
    rows, err := db.Query("SELECT idJuego, puntaje FROM juegos")
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()
    log.Println("Initial balances:")
    for rows.Next() {
        var idJuego, puntaje int
        if err := rows.Scan(&idJuego, &puntaje); err != nil {
            log.Fatal(err)
        }
        log.Printf("%d %d\n", idJuego, puntaje)
    }

}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	cwd, _ := os.Getwd()

	p := filepath.Join(cwd, "index.html")

	t := template.Must(template.ParseFiles(p))

	if err := t.Execute(w, nil); err != nil {
		log.Print(err.Error())
	}
}