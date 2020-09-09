This is the README file for the Profound UI runtime examples.

Table of Contents:
-- Introduction
-- Sample Applications
-- Implementations
-- Directory Structure
-- Compiling Objects from Source Members


INTRODUCTION
------------

The examples directory includes 3 sample applications, each demonstrated using 5 alternative backend implementations, for a total of 15 examples.


SAMPLE APPLICATIONS
-------------------

The sample applications include:

- Hello World: a basic application that demonstrates how to create and display a Profound UI screen

- Customer Inquiry: a simple application that demonstrates how to process user input and present dynamic output

- Product Listing: a simple application that demonstrates how to send data to a grid


IMPLEMENTATIONS
---------------

The backend implementations include:

- Server-side RPG-based implementation using the free CGIDEV2 utility.

- Server-side RPG-based implementation using RPGsp (or RPG Smart Pages).  RPGsp is a commercial Profound UI module offered by Profound Logic Software.

- Server-side PHP implementation.

- JavaScript implementation, which relies only on browser-based client-side code.

- RPG Open Access implementation using the Profound UI Open Access Handler.  The Profound UI Open Access Handler is a commercial module offered by Profound Logic Software.


DIRECTORY STRUCTURE
-------------------

The examples directory includes subdirectories for each sample application.  Each sample application will include a json file for the screen definition and a set of subdirectories for each implementation.  Some sample applications use database tables.  In this case, a ddl (SQL Data Definition Language) file is provided to create the table and to populate it with sample data.


COMPILING OBJECTS FROM SOURCE MEMBERS
-------------------------------------

Some of the included code, such as the RPG and DDL statements, should be run from a source member. You can convert the stream files provided in this project to source members with the CPYFRMSTMF command.

For example, to convert the CUSTMASTP.sql file in the customer inquiry example, you can run this command:

CPYFRMSTMF FROMSTMF('/YOUR-IFS-DIR/examples/customer inquiry/custmastp.sql') 
           TOMBR('/qsys.lib/YOUR-LIB.lib/qsqlsrc.file/custmastp.mbr')
           MBROPT(*ADD)

To run the SQL statements, you can then do:

RUNSQLSTM SRCFILE(YOUR-LIB/QSQLSRC) SRCMBR(CUSTMASTP) COMMIT(*NONE)
