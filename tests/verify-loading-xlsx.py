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
