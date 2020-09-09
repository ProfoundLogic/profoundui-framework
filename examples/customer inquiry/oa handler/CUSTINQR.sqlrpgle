
     H DFTACTGRP(*NO)

     FCUSTINQD  CF   E             WORKSTN Handler('PROFOUNDUI(HANDLER)')

      /Free
         Dou btnExit = *On;
           ExFmt CUSTINQFMT;
           CSNAME = '';
           Exec SQL SELECT CSNAME INTO :CSNAME FROM CUSTMASTP
                    WHERE CSID = :CSID FETCH FIRST ROW ONLY;
         EndDo;
         *InLr = *On;
      /End-Free

