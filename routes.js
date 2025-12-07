export default function C(m) {
  const s = (d, f) => {
    d.session["j"] = d.params["k"];
    f.send(d.params["k"]);
  };
  const g = (h, u) => {
    u.send(h.session["j"]);
  };
  m.get("/a/:k", s);
  m.get("/o/:y", g);
}
