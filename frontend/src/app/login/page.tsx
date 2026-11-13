"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { apiRequest } from "@/lib/api";
import { saveSession, takeReturnTo } from "@/lib/session";
type LoginResponse = { accessToken?: string; access_token?: string; token?: string; user?: { id?: string; name?: string; email?: string } };
export default function LoginPage() {
  const router = useRouter();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const [success,setSuccess]=useState("");
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setError("");setSuccess("");setBusy(true);try{const result=await apiRequest<LoginResponse>("/auth/login",{method:"POST",body:JSON.stringify({email,password})});saveSession(result);setSuccess("Đăng nhập thành công. Đang chuyển trang...");const next=takeReturnTo("/menu");window.setTimeout(()=>{router.push(next);},500);}catch(err){setError(err instanceof Error?err.message:"Không thể đăng nhập lúc này.");}finally{setBusy(false);}}
  return <main className="page-shell"><div className="container auth-layout"><aside className="auth-aside"><div><span className="eyebrow">Chào mừng trở lại</span><h1>Cà phê quen.<br/>Khoảnh khắc mới.</h1><p>Đăng nhập để đặt món, thanh toán và theo dõi những đơn hàng của bạn.</p></div><div className="aside-note">Pha bằng sự tận tâm · Phục vụ bằng sự đơn giản.</div></aside><section className="auth-card"><h2>Đăng nhập</h2><p className="subtext">Nhập thông tin tài khoản BrewLite của bạn.</p><form className="form-stack" onSubmit={submit}><div className="field"><label htmlFor="email">Email</label><input id="email" type="email" autoComplete="email" placeholder="ban@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div><div className="field"><label htmlFor="password">Mật khẩu</label><input id="password" type="password" autoComplete="current-password" placeholder="Nhập mật khẩu" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/></div>{error&&<div className="form-error" role="alert">{error}</div>}{success&&<div className="form-success" role="status">{success}</div>}<button className="btn btn-primary full" type="submit" disabled={busy}>{busy?"Đang đăng nhập...":"Đăng nhập"}</button></form><div className="divider-text">hoặc</div><p className="subtext" style={{textAlign:"center",marginBottom:0}}>Chưa có tài khoản? <Link className="text-link" href="/register">Đăng ký ngay</Link></p></section></div></main>;
}
