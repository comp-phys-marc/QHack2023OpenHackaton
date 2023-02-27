# JS-Bird 
An interactive tool for writing hybrid JS / Blackbird code in an editor.

This is a project developed for the **Xanadu QHack 2023** *Hybrid Quantum-Classical Computing Challenge*. The motivation for this editor is *enhance the processing* of results for any executable [BlackBird](https://quantum-blackbird.readthedocs.io/en/latest/index.html) program by incorporating JS based processing.

### App Demo 
[Processing GIF](Insert Link)

### How do we do it?
[Architecture Image]

### Usage Info 
 Currently our application is supported over the **MacOS** and the installation instructions are as follows - 

1. Clone the repository via `git clone <repo_link>`
2. Build the editor using the following steps - 
   a. Make sure you have `node` installed in your machine
   b. Open a terminal and go into the `editor` directory and type `npm install` to install the necessary packages 
   c. Building electron?
   d. Starting App?

3. Build and run the `flask` server as follows - 
    a. Make sure you have `python` and `pip` installed in your machine
    b. Open a new terminal and go into the `simulationservice` directory
    c. Type `pip install -r requirements.txt` to install necessary packages
    d. After this, go into the `service` directory and type `set FLASK_APP=app.py` followed by `flask run` to start the server

4. Execute code from the editor as highlighted in the application demo. 



### Technologies Used

1. **Editor** - ReactJS, jQuery, ElectronJS
2. **Simulation Service** - Flask, Strawberry Fields

### Future Scope 

- to do...

### Team - <font color = 'purple'>Q I/O</font>

1. [Ezekiel Ekondu Emmanuelaudu](https://i-ex3c.github.io/Portfolio/)
2. [Harshit Gupta](https://github.com/TheGupta2012)
3. [Marcus Edwards](https://github.com/comp-phys-marc)
4. [Sairaaj Surve](https://github.com/SairaajSurve)






