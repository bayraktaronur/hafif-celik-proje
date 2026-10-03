import openpyxl, zipfile
p="artifacts/loading-list.xlsx"
assert zipfile.ZipFile(p).testzip() is None
s=openpyxl.load_workbook(p).active
rows=[r for r in s.iter_rows(min_row=5,values_only=True) if r[6]=="Otomatik H adedi"]
assert {r[8]:r[5] for r in rows}=={"tuna-23":10,"tuna-24":10,"tuna-25":9,"tuna-26":2,"tuna-27":1,"tuna-28":4}
assert sum(r[5] for r in rows)==36
assert s.freeze_panes=="A5"
assert all(c.data_type!="f" for row in s for c in row)
print("PASS XLSX structure, six Tuna matches, numeric quantities and text cells")

corners=[r for r in s.iter_rows(min_row=5,values_only=True) if r[1]=="Köşe direği"]
assert len(corners)==1 and corners[0][2]=="98 × 98 × 2500 mm" and corners[0][5]==8 and corners[0][8]=="tuna-22"
print("PASS XLSX corner product 98x98x2500, quantity 8 and Tuna reference")

us=[r for r in s.iter_rows(min_row=5,values_only=True) if r[1]=="Çektirme U"]
assert len(us)==1 and us[0][2]=="60 × 2440 mm" and us[0][4]==3 and us[0][5]==4 and us[0][10]==1 and us[0][8]=="tuna-29"
print("PASS XLSX U 60x2440: 3 installed + 1 spare = 4 shipped")

frames=[r for r in s.iter_rows(min_row=5,values_only=True) if r[1]=="Alt çerçeve"]
assert {r[2]:(r[4],r[5],r[10]) for r in frames}=={"100 × 2500 mm":(15,16,1),"60 × 2500 mm":(9,10,1)}
print("PASS XLSX bottom frames: base, shipment and spare")
