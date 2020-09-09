
     H DFTACTGRP(*NO)

     FPRODLISTD CF   E             WORKSTN SFILE(PRODSFL : RRN)
     F                                     HANDLER('PROFOUNDUI(HANDLER)')

     D RRN             S             10I 0

      /Free

         Dou btnExit = *On;

           // Clear Grid
           ClearSFL = *On;
           Write PRODCTL;
           ClearSFL = *Off;

           // Load Grid
           Exec SQL DECLARE cursor1 SCROLL CURSOR FOR
             SELECT PRID, PRNAME, PPRICE, PSTOCK FROM PRODUCTSP;
           Exec SQL Open cursor1;
           Exec SQL Fetch cursor1 INTO :PRID, :PRNAME, :PPRICE, :PSTOCK;
           Dow (SQLCod <> 100) and (SQLCod >= 0);
             RRN +=1;
             Write PRODSFL;
             Exec SQL Fetch cursor1 INTO :PRID, :PRNAME, :PPRICE, :PSTOCK;
           EndDo;
           Exec SQL Close cursor1;

           ExFmt PRODCTL;

         EndDo;

         *InLr = *On;

      /End-Free

