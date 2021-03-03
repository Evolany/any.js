# Date.prototype.*

### .format()
| keyword  |   desc.           |  example      |
|--|--|--|
| YYYY  |   4-digit year           |  1999      |
| YY    |   2-digit year           |  99        |
| MMMM  |   full month name        |  February  |
| MMM   |   3-letter month name    |  Feb       |
| MM    |   2-digit month number   |  02        |
| M     |   month number           |  2         |
| DDDD  |   full weekday name      |  Wednesday |
| DDD   |   3-letter weekday name  |  Wed       |
| W     |   1-kanji weekday name   |  金        |
| DD    |   2-digit day number     |  09        |
| D     |   day number             |  9         |
| th    |   day ordinal suffix     |  nd        |
| hhh   |   military/24-based hour |  17        |
| hh    |   2-digit hour           |  05        |
| h     |   hour                   |  5         |
| mm    |   2-digit minute         |  07        |
| m     |   minute                 |  7         |
| ss    |   2-digit second         |  09        |
| s     |   second                 |  9         |
| ampm  |   "am" or "pm"           |  pm        |
| AMPM  |   "AM" or "PM"           |  PM        |
```
new Date().format( "YYYY-MM-DD hh:mm:ss (W)" ) = 2011-10-10 23:11:34 (金)
```