# JS-Bird 
An interactive tool for writing hybrid JS / Blackbird code in an editor.

This is a project developed for the **Xanadu QHack 2023** *Hybrid Quantum-Classical Computing Challenge*. The motivation for this editor is *enhance the processing* of results for any executable [BlackBird](https://quantum-blackbird.readthedocs.io/en/latest/index.html) program by incorporating JS based processing.

The editor expects 1 Blackbird block followed by 1 JS block. Both are executed, one with the help of a StrawberryFields based backend API and one using eval() in the frontend. Both may be edited together in one editor application where the results of their executions may also be viewed.

### Design
<p float="left">
<img src="design/Frame_2.png" width="47%" height="20%">
<img src="design/Frame_10.png" width="47%" height="20%">
 </p>

<p float="left">
<img src="design/Frame_11.png" width="47%" height="20%">
<img src="design/Frame_14.png" width="32%" height="10%">
 </p>

### App Demo 
<img src="design/qhack-23-final.gif" width="80%" height="30%">


**<p>1. The StrawberryFields / JS editor</p>**
<img src="design/0.png" height="30%" width="70%" alt="Editor">

**<p>2. Opening a file in Editor</p>**
<img src="design/1.png" height="30%" width="70%" alt="Open">

**<p>3. Editing a file containing a Blackbird followed by a JS block</p>**
<img src="design/2.png" height="30%" width="70%" alt="Edit">


**<p>4. Running the code</p>**
<p float="left">
<img src="design/3.png" width="41%" height="23%">
<img src="design/4.png" width="47%" height="35%">
 </p>
 
 
**<p>5. Viewing the output</p>**
<img src="design/5.png" height="30%" width="70%" alt="Edit">

### Usage Info 
 Currently our application is supported over the **MacOS** and the installation instructions are as follows - 

1. Clone the repository via `git clone <repo_link>`
2. Build the editor using the following steps - 
   a. Make sure you have `node` installed in your machine
   b. Open a terminal and go into the `editor` directory and type `npm install` to install the necessary packages 
   c. Run the following in the project directory:
`
npm install electron-packager -g &&
electron-packager .
`
   d. Open the app in the build directory

3. Build and run the `flask` server as follows - 
    a. Make sure you have `python` and `pip` installed in your machine
    b. Open a new terminal and go into the `simulationservice` directory
    c. Type `pip install -r requirements.txt` to install necessary packages
    d. After this, go into the `service` directory and type `set FLASK_APP=app.py` followed by `flask run` to start the server

4. Execute code from the editor as highlighted in the application demo. 



### Technologies Used

1. **Editor** - jQuery, ElectronJS
2. **Simulation Service** - Flask, StrawberryFields

### Future Scope 

- Support multiple blocks of each of SF and JS code
 
### Team - <font color = 'purple'>Q I/O</font>

1. [Ezekiel Ekondu Emmanuelaudu](https://i-ex3c.github.io/Portfolio/)
2. [Harshit Gupta](https://github.com/TheGupta2012)
3. [Marcus Edwards](https://github.com/comp-phys-marc)
4. [Sairaaj Surve](https://github.com/SairaajSurve)






