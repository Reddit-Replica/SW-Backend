/* eslint-disable max-len */
import dotenv from "dotenv";
import mailgun from "mailgun-js";
import User from "../models/User.js";

dotenv.config();
const FRONT_BASE = process.env.FRONT_BASE.trim();

const API_KEY = process.env.MAILGUN_API_KEY.trim();
const SENDER_EMAIL = process.env.SENDER_EMAIL.trim();
const DOMAIN = process.env.DOMAIN.trim();

const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

/**
 * This function is responsible for sending a reset password
 * email from a given email to another. It inserts a user id
 * and a token in the href path of the html content of the email
 *
 * @param {string} user User object of the receiver user
 * @param {string} token A crypto token used for verification
 * @returns {boolean} True if the email was sent and false if any error occured
 */

// eslint-disable-next-line max-len
export async function sendResetPasswordEmail(user, token) {
  try {
    mg.messages().send({
      from: SENDER_EMAIL,
      to: user.email,
      subject: "Read-it Password Reset",
      html: `
			<div class="m_-8376988204030579956body" style="padding:0!important;margin:0 auto!important;display:block!important;min-width:100%!important;width:100%!important;background:#ffffff">
			<center>
			<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100%" bgcolor="#ffffff" class="m_-8376988204030579956gwfw">
			<tbody><tr>
			<td style="margin:0;padding:0;width:100%" align="center">
			<table width="600" border="0" cellspacing="0" cellpadding="0" class="m_-8376988204030579956m-shell">
			<tbody><tr>
			<td class="m_-8376988204030579956td" style="width:600px;min-width:600px;font-size:0pt;line-height:0pt;padding:0;margin:0;font-weight:normal">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			
			<tbody><tr>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956mpx-16" style="padding-left:32px;padding-right:32px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956mpb-20" style="padding-top:16px;padding-bottom:28px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956mpb-28" style="padding-bottom:34px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956w-104" width="112" style="font-size:0pt;line-height:0pt;text-align:left">
				<a href="${FRONT_BASE}/" target="_blank">
					<img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" width="112" height="39" border="0" alt="" class="CToWUd" data-bit="iit">
				</a>
			</td>
			<td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td align="right">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td width="16" valign="top" style="font-size:0pt;line-height:0pt;text-align:left">
				<img src="${user.avatar}" width="16" height="16" border="0" alt="" class="CToWUd" data-bit="iit"></td>
			<td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299">
				<a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#7a9299" target="_blank">
					<span style="text-decoration:none;color:#7a9299">u/${user.username}</span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mfz-14 m_-8376988204030579956mlh-16 m_-8376988204030579956mpb-20" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:28px">
			Hi there,
			<br><br>
			
			Looks like a request was made to <span class="il">reset</span> the <span class="il">password</span> for your ${user.username} <span class="il">Reddit</span> account. No problem! You can <span class="il">reset</span> your <span class="il">password</span> now using the lovely button below.
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mpb-28" align="center" style="padding-bottom:34px">
			<table width="214" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_-8376988204030579956btn-14" bgcolor="#0079d3" style="border-radius:4px;font-size:14px;line-height:18px;color:#ffffff;font-family:Helvetica,Arial,sans-serif;text-align:center;min-width:auto!important">
				<a href="${FRONT_BASE}/reset-password/${user.id}/${token}" style="display:block;padding:8px;text-decoration:none;color:#ffffff" target="_blank">
					<span style="text-decoration:none;color:#ffffff"><strong><span class="il">Reset</span> <span class="il">Password</span></strong></span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mfz-14 m_-8376988204030579956mlh-16 m_-8376988204030579956mpb-20" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:28px">
			If you didn't want to <span class="il">reset</span> your <span class="il">password</span>, you can safely ignore this email and carry on as usual. And if you need any more help logging in to your <span class="il">Reddit</span> account, check out our <a href="https://www.reddithelp.com/en/categories/privacy-security/account-security" style="text-decoration:none;color:#006cbf" target="_blank"><span style="text-decoration:none;color:#006cbf">Account Security FAQs</span></a> or <a href="https://www.reddithelp.com/en/submit-request" style="text-decoration:none;color:#006cbf" target="_blank"><span style="text-decoration:none;color:#006cbf">contact us</span></a>.
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			
			
			<tr>
			<td class="m_-8376988204030579956mpt-16 m_-8376988204030579956mpt-34" style="padding-top:48px" bgcolor="#f2f5f6">
			<table width="100%" cellspacing="0" cellpadding="0" border="0">
			<tbody>
			<tr>
			<td class="m_-8376988204030579956w-104 m_-8376988204030579956mpb-20" style="font-size:0pt;line-height:0pt;text-align:center;padding-bottom:28px"><a href="${FRONT_BASE}/" target="_blank" alt="" width="115" height="40" border="0" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			<tr>
			<td style="padding-bottom:20px" align="center">
			<table cellspacing="0" cellpadding="0" border="0">
			<tbody>
			<tr>
			<td class="m_-8376988204030579956w-114" style="font-size:0pt;line-height:0pt;text-align:left" valign="top"><a href="https://apps.apple.com/us/app/reddit/id1064216828" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://apps.apple.com/us/app/reddit/id1064216828&amp;source=gmail&amp;ust=1671486524932000&amp;usg=AOvVaw3AphA6twGeJ4Ei13l_pjR_"><img src="https://ci3.googleusercontent.com/proxy/LECwhMZFS7zsvkAGgSy-KFmOiIBWQlC-xrIPw1wOhWgGgQSQiVO30RU9GoxwCBGfzsIS4mjH10YiMkpklZrrScGHBUWjL_PRkpulIE0=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/app_store_8_8.png" alt="" width="124" height="37" border="0" class="CToWUd" data-bit="iit"></a></td>
			<td class="m_-8376988204030579956w-8" style="font-size:0pt;line-height:0pt;text-align:left" width="10"></td>
			<td class="m_-8376988204030579956w-114" style="font-size:0pt;line-height:0pt;text-align:left" valign="top"><a href="https://play.google.com/store/apps/details?id=com.reddit.frontpage" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://play.google.com/store/apps/details?id%3Dcom.reddit.frontpage&amp;source=gmail&amp;ust=1671486524932000&amp;usg=AOvVaw0p0ROTwsd2YfFtLJ5MTWaf"><img src="https://ci6.googleusercontent.com/proxy/Uc8pkryaoD6Czm6F_Q53DFW4z8ZiTW0fKGCBzPWMMi4y-LjuGAwkZJ3AUbDsFW6b06b8BYk01LzdBZgHJxbIj23Qq77lDt7IPQtKVqg0RA=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/google_play_8_8.png" alt="" width="124" height="37" border="0" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			</tbody>
			</table>
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mpx-12 m_-8376988204030579956mpb-20" style="padding-bottom:20px;padding-left:24px;padding-right:24px">
			<table width="100%" cellspacing="0" cellpadding="0" border="0">
			<tbody>
			<tr>
			<td class="m_-8376988204030579956mfz-12 m_-8376988204030579956mlh-18" style="font-size:16px;line-height:18px;color:#687981;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;text-align:center">
			This email was intended for u/${user.username}. <a style="text-decoration:none;color:#006cbf"><span style="text-decoration:none;color:#006cbf">Unsubscribe</span></a> from  messages, or visit your settings to manage what emails <span class="il">Reddit</span> sends you.
			</td>
			</tr>
			</tbody>
			</table>
			</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956mfz-12 m_-8376988204030579956mlh-18 m_-8376988204030579956mpx-12" style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;color:#222222;text-align:center;padding-left:24px;padding-right:24px">Faculty Of Engineering Cairo University</td>
			</tr>
			<tr>
			<td class="m_-8376988204030579956fluid-img" style="font-size:0pt;line-height:0pt;text-align:left"><img src="https://ci6.googleusercontent.com/proxy/jWfzz4U5cA7v4v6I67-jPvk1tWtaxG7FIdD5c4vPlN6oN2aE19dNtG_LHwjd4gO74oke1BW0gjfMSvccRwYn3BTD8pc0421hpY_NLFBnJw=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/footer_logo_8_8.png" alt="" width="600" height="115" border="0" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 552px; top: 713px;"><div id=":98" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" title="Download" role="button" tabindex="0" aria-label="Download attachment " jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB" data-tooltip-class="a1V"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div></div></td>
			</tr>
			</tbody>
			</table>
			</td>
			</tr>
			
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</center>
			<img alt="" src="https://ci5.googleusercontent.com/proxy/xY03fzVRjQtxkqW0kfKqqpOaNZhARRLJ6hr94em-4JAwqit3kBBM7HtUDwjV-6sM9eYcTxNWOM_gETEOoOtHUjhK3DjShLWYq9OYiVPh_v5vbH79nXFP_FXw-lgKId5ezWAz31JoEBlTzfZWWIG-X0QeYGoAzl1zXPHM7FLjunnfNi9f9GAP8ME7009B8AorUHsX8Nh9uUmNnVjD=s0-d-e1-ft#https://ql9whnmm.r.us-east-1.awstrack.me/I0/010001840b8a690a-a98182e0-166f-4315-84b5-62ea2a5c983e-000000/TU0_xh-U2pIacvQ2-gFKFoD8Hs4=292" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit"><div class="yj6qo"></div><div class="adL">
			</div></div>
					`,
    });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * This function used to send a verification email to certain user
 * to verify his email after sign up
 *
 * @param {string} user User object of the receiver user
 * @param {string} token Verification token that will be used to verify the email
 * @returns {boolean} True if the email was sent successfully and false if any error occured
 */
export function sendVerifyEmail(user, token) {
  try {
    mg.messages().send({
      from: SENDER_EMAIL,
      to: user.email,
      subject: "Read-it Verify Email",
      html: `
			<div class="m_4332781606896536018body" style="padding:0!important;margin:0 auto!important;display:block!important;min-width:100%!important;width:100%!important;background:#ffffff">
			<center>
			<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100%" bgcolor="#ffffff" class="m_4332781606896536018gwfw">
			<tbody><tr>
			<td style="margin:0;padding:0;width:100%" align="center">
			<table width="600" border="0" cellspacing="0" cellpadding="0" class="m_4332781606896536018m-shell">
			<tbody><tr>
			<td class="m_4332781606896536018td" style="width:600px;min-width:600px;font-size:0pt;line-height:0pt;padding:0;margin:0;font-weight:normal">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			
			
			<tbody><tr>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018mpx-16" style="padding-left:32px;padding-right:32px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018mpb-20" style="padding-top:16px;padding-bottom:28px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018mpb-40" style="padding-bottom:54px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018w-104" width="112" style="font-size:0pt;line-height:0pt;text-align:left"><a href="${FRONT_BASE}/" target="_blank"><img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" width="112" height="39" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			<td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td align="right">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td width="16" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><img src="${user.avatar}" width="16" height="16" border="0" alt="" class="CToWUd" data-bit="iit"></td>
			<td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299"><a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#7a9299" target="_blank"><span style="text-decoration:none;color:#7a9299">u/${user.username}</span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mfz-14 m_4332781606896536018mlh-16" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:34px">
			Hi there,
			<br><br>
			
			Your email address <a style="text-decoration:none;color:#000000"><span style="text-decoration:none;color:#000000">${user.email}</span></a> has been added to your <span style="text-decoration:none;color:#000000">${user.username}</span> <span class="il">Reddit</span> account. But wait, we're not done yet...
			<br><br>
			
			To finish <span class="il">verifying</span> your email address and securing your account, <span style="text-decoration:none;color:#000000">click the button below</span>.
			</td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mpb-28" align="center" style="padding-bottom:40px">
			<table width="214" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018btn-14" bgcolor="#0079d3" style="border-radius:4px;font-size:14px;line-height:18px;color:#ffffff;font-family:Helvetica,Arial,sans-serif;text-align:center;min-width:auto!important">
				<a href="${FRONT_BASE}/verify-email/${user.id}/${token}" style="display:block;padding:8px;text-decoration:none;color:#ffffff" target="_blank"><span style="text-decoration:none;color:#ffffff"><strong><span class="il">Verify</span> Email Address</strong></span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mpb-20" bgcolor="#f1f5f6" style="padding-bottom:34px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018fluid-img m_4332781606896536018mpb-8" style="font-size:0pt;line-height:0pt;text-align:left"><a href="${FRONT_BASE}/" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/jWfzz4U5cA7v4v6I67-jPvk1tWtaxG7FIdD5c4vPlN6oN2aE19dNtG_LHwjd4gO74oke1BW0gjfMSvccRwYn3BTD8pc0421hpY_NLFBnJw=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/footer_logo_8_8.png" width="600" height="125" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mpb-20" align="center" style="padding-bottom:40px">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_4332781606896536018w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><a href="https://apps.apple.com/us/app/reddit/id1064216828" target="_blank"><img src="https://ci3.googleusercontent.com/proxy/LECwhMZFS7zsvkAGgSy-KFmOiIBWQlC-xrIPw1wOhWgGgQSQiVO30RU9GoxwCBGfzsIS4mjH10YiMkpklZrrScGHBUWjL_PRkpulIE0=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/app_store_8_8.png" width="124" height="37" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			<td class="m_4332781606896536018w-8" width="10" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td class="m_4332781606896536018w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><a href="https://play.google.com/store/apps/details?id=com.reddit.frontpage" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/Uc8pkryaoD6Czm6F_Q53DFW4z8ZiTW0fKGCBzPWMMi4y-LjuGAwkZJ3AUbDsFW6b06b8BYk01LzdBZgHJxbIj23Qq77lDt7IPQtKVqg0RA=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/google_play_8_8.png" width="124" height="37" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_4332781606896536018mfz-12 m_4332781606896536018mlh-18 m_4332781606896536018mpx-12" style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;color:#222222;text-align:center;padding-left:24px;padding-right:24px">Faculty Of Engineering Cairo University</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</center>
			<img alt="" src="https://ci4.googleusercontent.com/proxy/71xIuvtxb0Rrjen1WWQgvRRF5MwJiLBBQYgPyX1DQdL1SYPQxCDxxZEjiPNOAJrH_vs58yIj1iIirEDYsyxMqcqzVzBS6TBjdqUOV7ApnV5uU34dAY3_TllLZECjD-IMKcW-ghdHV_ksSDJxnQmTsGOeTzIgwqnby1skakXdCystH-lIR-CnbpBuisuPJkSLjrHMpjEF4KvZrJZ8=s0-d-e1-ft#https://ql9whnmm.r.us-east-1.awstrack.me/I0/01000183fed3e4df-d85bfb81-0ec3-4785-8a86-4980148c07da-000000/iNypIlqMsVRDnOLzVe3RvzkFdZM=292" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit"><div class="yj6qo"></div><div class="adL">
			</div></div>
        `,
    });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * This function used to send an email with the username
 * of the user who forget his username
 *
 * @param {string} user User object of the receiver user
 * @returns {boolean} True if the email was sent successfully and false if any error occured
 */
export function sendUsernameEmail(user) {
  try {
    mg.messages().send({
      from: SENDER_EMAIL,
      to: user.email,
      subject: "Read-it Forget Username",
      html: `
			<div class="m_7551772197302646080body" style="padding:0!important;margin:0 auto!important;display:block!important;min-width:100%!important;width:100%!important;background:#ffffff">
			<center>
			<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100%" bgcolor="#ffffff" class="m_7551772197302646080gwfw">
			<tbody><tr>
			<td style="margin:0;padding:0;width:100%" align="center">
			<table width="600" border="0" cellspacing="0" cellpadding="0" class="m_7551772197302646080m-shell">
			<tbody><tr>
			<td class="m_7551772197302646080td" style="width:600px;min-width:600px;font-size:0pt;line-height:0pt;padding:0;margin:0;font-weight:normal">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080mpx-16" style="padding-left:32px;padding-right:32px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080mpb-20" style="padding-top:16px;padding-bottom:28px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080mpb-28" style="padding-bottom:34px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080w-104" width="112" style="font-size:0pt;line-height:0pt;text-align:left"><a href="${FRONT_BASE}/" target="_blank"><img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" width="112" height="39" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			<td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:0pt;line-height:0pt;text-align:left">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td align="right">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td width="16" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><img src="${user.avatar}" width="16" height="16" border="0" alt="" class="CToWUd" data-bit="iit"></td>
			<td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299"><a href="${FRONT_BASE}/user/${user.username}"><span style="text-decoration:none;color:#7a9299">u/${user.username}</span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_7551772197302646080mfz-14 m_7551772197302646080mlh-16 m_7551772197302646080mpb-34" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:28px">
			Hi there,
			<br><br>
			
			You forgot it didn't you? Hey, it happens. Here you go:
			<br><br>
			
			
			Your username is <a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#006cbf" target="_blank"><span style="text-decoration:none;color:#006cbf"><span style="color:#006cbf"><strong>${user.username}</strong></span></span></a>
			<br><br>
			
			(Username checks out, nicely done.)
			<br><br>
			
			
			</td></tr><tr>
			<td class="m_7551772197302646080mpb-28" align="center" style="padding-bottom:34px">
			<table width="214" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080btn-14" bgcolor="#0079d3" style="border-radius:4px;font-size:14px;line-height:18px;color:#ffffff;font-family:Helvetica,Arial,sans-serif;text-align:center;min-width:auto!important"><a href="${FRONT_BASE}/login/" style="display:block;padding:8px;text-decoration:none;color:#ffffff" target="_blank"><span style="text-decoration:none;color:#ffffff"><strong>Log In</strong></span></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			
			
			<tr>
			<td class="m_7551772197302646080mfz-14 m_7551772197302646080mlh-16 m_7551772197302646080mpb-34" style="font-size:16px;line-height:18px;color:#000000;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:28px">
			
			If you didn't ask to recover your username, you can safely ignore this email and carry on as usual. And if you need any more help logging in to your Reddit account, check out our <a href="https://www.reddithelp.com/en/categories/privacy-security/account-security" style="text-decoration:none;color:#006cbf" target="_blank"><span style="text-decoration:none;color:#006cbf">contact us</span></a>.
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_7551772197302646080mpb-20" bgcolor="#f1f5f6" style="padding-bottom:34px">
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080fluid-img m_7551772197302646080mpb-8" style="font-size:0pt;line-height:0pt;text-align:left"><a href="${FRONT_BASE}/" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/jWfzz4U5cA7v4v6I67-jPvk1tWtaxG7FIdD5c4vPlN6oN2aE19dNtG_LHwjd4gO74oke1BW0gjfMSvccRwYn3BTD8pc0421hpY_NLFBnJw=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/footer_logo_8_8.png" width="600" height="125" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			<tr>
			<td class="m_7551772197302646080mpb-20" align="center" style="padding-bottom:40px">
			<table border="0" cellspacing="0" cellpadding="0">
			<tbody><tr>
			<td class="m_7551772197302646080w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><a href="https://apps.apple.com/us/app/reddit/id1064216828" target="_blank"><img src="https://ci3.googleusercontent.com/proxy/LECwhMZFS7zsvkAGgSy-KFmOiIBWQlC-xrIPw1wOhWgGgQSQiVO30RU9GoxwCBGfzsIS4mjH10YiMkpklZrrScGHBUWjL_PRkpulIE0=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/app_store_8_8.png" width="124" height="37" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			<td class="m_7551772197302646080w-8" width="10" style="font-size:0pt;line-height:0pt;text-align:left"></td>
			<td class="m_7551772197302646080w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><a href="https://play.google.com/store/apps/details?id=com.reddit.frontpage" target="_blank"><img src="https://ci6.googleusercontent.com/proxy/Uc8pkryaoD6Czm6F_Q53DFW4z8ZiTW0fKGCBzPWMMi4y-LjuGAwkZJ3AUbDsFW6b06b8BYk01LzdBZgHJxbIj23Qq77lDt7IPQtKVqg0RA=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/google_play_8_8.png" width="124" height="37" border="0" alt="" class="CToWUd" data-bit="iit"></a></td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			<tr>
			<td class="m_7551772197302646080mfz-12 m_7551772197302646080mlh-18 m_7551772197302646080mpx-12" style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;color:#222222;text-align:center;padding-left:24px;padding-right:24px">Faculty Of Engineering Cairo University</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</td>
			</tr>
			</tbody></table>
			</center>
			<img alt="" src="https://ci6.googleusercontent.com/proxy/bwtRB9aWkt1s-aeb5hquj-dYog3VTizFCqxQGWizRsqHihSP_2yl93sR9TU8wn0NH8vNB_BP3xN4ktXaFlzI695Z84d8yxENnBa8d_ihZW4voPyaR5mciyEwFxk2x8Z2Om0Zdrr1BmfmkJLpqMo2oC82IgYOgDc0iZVIIcKQUYS33QM7VbWR8Wt8Hiyy9Fgq3izv2FSq4anV0lbN=s0-d-e1-ft#https://ql9whnmm.r.us-east-1.awstrack.me/I0/01000184482b4f8c-515a98cc-3544-4c3e-a065-532c15144bde-000000/SUI7vSjxt2z0Ct7tFFxXBBkNgc4=294" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit"><div class="yj6qo"></div><div class="adL">
			</div></div>
        `,
    });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * This function used to send an email with the username
 * of the user who forget his username
 *
 * @param {string} user User object of the receiver user
 * @returns {boolean} True if the email was sent successfully and false if any error occured
 */

export async function sendPostReplyMail(user, post, comment) {
  try {
    let postPlace;
    if (post.subreddit) {
      postPlace = post.subreddit;
    } else {
      postPlace = "u_" + post.ownerUsername;
    }
    const commentWriter = await User.find({ username: comment.username });
    const picture = commentWriter.picture;
    mg.messages().send({
      from: SENDER_EMAIL,
      to: user.email,
      subject: `${comment.ownerUsername}replied to your post in r/${postPlace}`,
      html: `
	  <div class=""><div class="aHl"></div><div id=":17s" tabindex="-1"></div><div id=":17h" class="ii gt" jslog="20277; u014N:xr6bB; 4:W251bGwsbnVsbCxbXV0."><div id=":17g" class="a3s aiL msg8901276260374497905"><u></u>
	  <div class="m_8901276260374497905body" style="padding:0!important;margin:0 auto!important;display:block!important;min-width:100%!important;width:100%!important;background:#ffffff">
	  <center>
	  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100%" bgcolor="#ffffff" class="m_8901276260374497905gwfw">
	  <tbody><tr>
	  <td style="margin:0;padding:0;width:100%" align="center">
	  <table width="600" border="0" cellspacing="0" cellpadding="0" class="m_8901276260374497905m-shell">
	  <tbody><tr>
	  <td class="m_8901276260374497905td" style="width:600px;min-width:600px;font-size:0pt;line-height:0pt;padding:0;margin:0;font-weight:normal">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  
	  
	  <tbody><tr>
	  <td style="font-size:0pt;line-height:0pt;text-align:left">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8901276260374497905mpx-16" style="padding-left:32px;padding-right:32px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="padding-top:16px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8901276260374497905mpb-48" style="padding-bottom:55px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8901276260374497905w-104" width="112" style="font-size:0pt;line-height:0pt;text-align:left">
	  <a href="${FRONT_BASE}/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252F/1/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/C9SA6ev9fQNgWg8ZkRbP44Gr53JVhyl1TH4ktN3MqDo%3D279&amp;source=gmail&amp;ust=1671629384633000&amp;usg=AOvVaw35C4DLgdBsFRWE5XTJAE8k"><img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" width="112" height="39" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  <td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td style="font-size:0pt;line-height:0pt;text-align:left">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td align="right">
	  <table border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td width="16" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><img src="${FRONT_BASE}/api/${user.avatar}" width="16" height="16" border="0" alt="" class="CToWUd" data-bit="iit"></td>
	  <td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299">
	  <a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#7a9299" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FRequirementOrnery717%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/1/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/jEOwJSF4wYxFkx-mIK0aYEgEKAl-FCaA9AWO73jVA1A%3D279&amp;source=gmail&amp;ust=1671629384633000&amp;usg=AOvVaw07ZnmkIJjqZZVec__231Ke">
	  <span style="text-decoration:none;color:#7a9299"> u/${user.username}</span>
	  </a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>

	  <td style="font-size:0pt;line-height:0pt;text-align:center;padding-bottom:14px">
	  <a href="${FRONT_BASE}/user/${user.username}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FBlaze428%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/1/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/flTjhGvGA4fnhI9sqvIhslzIR-3h67gEyE2FTqlDImg%3D279&amp;source=gmail&amp;ust=1671629384633000&amp;usg=AOvVaw14qJr-anatvmW32y-yjXlc">
	  <div style="border:1px solid #edeff1;border-radius:50%;margin:auto;width:88px;height:88px;background-position:center;background-repeat:no-repeat;background-size:100% 100%;background-image:url('${FRONT_BASE}/api/${picture}')">
	  <img src="https://ci6.googleusercontent.com/proxy/iuhg8zCc6K93xMCoXYzpm5jR51yKpy9uKpRsT7qWtS_aYc3WZ4lPuOe9vjV24PYBDCui4LB2ZiYXS8Ccr6zrqBF0SsFfUZy4ZL1eaFSCS2Zdvg=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/post_reply_icon@4x.png" alt="" style="border:0;width:41px;height:41px;padding-top:56px;padding-left:56px" class="CToWUd" data-bit="iit">
    </div>
	  </a>
	  </td>
	  </tr>
	  <tr>
		  
	  <td class="m_8901276260374497905mfz-16 m_8901276260374497905mlh-18 m_8901276260374497905mpb-28" style="font-size:20px;line-height:23px;color:#313e42;font-family:Helvetica,Arial,sans-serif;font-weight:normal;min-width:auto!important;text-align:center;padding-bottom:34px">
	  <a href="${FRONT_BASE}/user/${comment.ownerUsername}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FBlaze428%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/2/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/Hl5l8eiUZHzq6T9b039aPrmmhgAiIFNRI_Q7Zq9O-sg%3D279&amp;source=gmail&amp;ust=1671629384633000&amp;usg=AOvVaw2Fcq1BKk1OeRbST-xfAG39">
	  <span style="text-decoration:none;color:#006cbf">
	  <strong style="color:#006cbf">u/${comment.ownerUsername}</strong>
	  </span>
	  </a>
	  replied to your post in
	  
	  <span class="m_8901276260374497905m-hide"><br></span>
	  <a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#313e42" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Fu_RequirementOrnery717%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/1/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/VWAVLF0kOOY1ZP3b9bU5Cu98pb4o05AKIYCPC-OPWVM%3D279&amp;source=gmail&amp;ust=1671629384633000&amp;usg=AOvVaw07rWHnaOerLxgMa0jTsXx2">
	  <span style="text-decoration:none;color:#313e42">r/${postPlace}</span>
	  </a>
	  <span style="color:#a7b4b8">· </span>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td style="border-bottom:1px solid #ebeef0">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="padding-bottom:8px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  </td>
	  
	  <!--mehtagen hena n7ut l link bta3 l receiver--> 
	  <td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299">
	  <a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#1b2426" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Fu_RequirementOrnery717%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/2/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/JQY3WeLVfe55f0-2tVojgGK7lDgZdSbtrUFbpkE30RI%3D279&amp;source=gmail&amp;ust=1671629384633000&amp;usg=AOvVaw0bT2-eH_yfqSe4GAEAp-6k">
	  <span style="text-decoration:none;color:#1b2426">
	  <strong style="font-size:14px;line-height:18px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#1b2426">r/${postPlace}</strong>
	  </span>
	  </a>
	  <br>
	  <a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#7a9299" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FRequirementOrnery717%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/2/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/JOOu53Z2jfUmH469HJxsbC1XafhsxEp9Bz_MO0I4A0E%3D279&amp;source=gmail&amp;ust=1671629384633000&amp;usg=AOvVaw23KTTlHTVRiMbAaEdL_PmH">
	  <span style="text-decoration:none;color:#7a9299">u/${user.username}</span>
	  </a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8901276260374497905mfz-14 m_8901276260374497905mlh-16" style="font-size:18px;line-height:22px;color:#1b2426;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:4px">
	  <a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#1b2426" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Fu_RequirementOrnery717%252Fcomments%252Fzmlbfs%252Fnmnm%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/2/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/V-HwoHTRw0smNVhOQBwTfw1OABXQXBH0wNl_Eh1aoDU%3D279&amp;source=gmail&amp;ust=1671629384633000&amp;usg=AOvVaw073xOZv5sNkvaGQdxk0SqW">
	  <span style="text-decoration:none;color:#1b2426">
	  <strong>${post.title}</strong>
	  </span>
	  </a>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8901276260374497905mpb-12" style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299;padding-bottom:14px">
	  <a style="text-decoration:none;color:#7a9299" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Fu_RequirementOrnery717%252Fcomments%252Fzmlbfs%252Fnmnm%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/3/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/SCAP7U257K1zXZNpqsJv1x9TpXUsVKOLuGo_ihIA6a0%3D279&amp;source=gmail&amp;ust=1671629384633000&amp;usg=AOvVaw08gMak5iEbixf0_3vjZw2y">
	  <span style="text-decoration:none;color:#7a9299">${comment.numberOfVotes}
	  points</span>
	  </a>
	  ·
	  <a style="text-decoration:none;color:#7a9299" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Fu_RequirementOrnery717%252Fcomments%252Fzmlbfs%252Fnmnm%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/4/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/Qcfj-Fr9XBwrNwR9XOQCvQ5ikFhUTQIV_N63YlPEPxs%3D279&amp;source=gmail&amp;ust=1671629384634000&amp;usg=AOvVaw2jpA17eOs3j70FMEKcgW7s">
	  <span style="text-decoration:none;color:#7a9299">${post.numberOfComments}
	  comments</span>
	  </a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8901276260374497905mpt-8" style="padding-top:14px;padding-bottom:48px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299;padding-bottom:4px;font-style:normal;font-weight:400">
	  <a target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FBlaze428%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/3/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/hDl2XP1jo8IBsHzWwGWMXQS3jruqGnYcMoxy_6DgAd4%3D279&amp;source=gmail&amp;ust=1671629384634000&amp;usg=AOvVaw2WH6z5IFMx3FIEo9pLaJV1">
	  <span style="text-decoration:none;color:#7a9299">u/${comment.ownerUsername}</span>
	  </a>
	  ·
	  <a style="text-decoration:none;color:#7a9299" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Fu_RequirementOrnery717%252Fcomments%252Fzmlbfs%252Fnmnm%252Fj0bkrs5%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/1/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/JZ8LSucn1C-0OHtTlqoyJtGsZmscFdRWWtv9bP3X42o%3D279&amp;source=gmail&amp;ust=1671629384634000&amp;usg=AOvVaw0rsxWlCDXtWud591bf2flo">
	  <span style="text-decoration:none;color:#7a9299">${comment.numberOfVotes} 
	  votes</span>
	  </a>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8901276260374497905mpb-28 m_8901276260374497905mfz-14 m_8901276260374497905mlh-18" style="font-size:16px;line-height:21px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#1b2426;padding-bottom:35px;font-style:normal;font-weight:400">
	  <a style="text-decoration:none;color:#1b2426" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Fu_RequirementOrnery717%252Fcomments%252Fzmlbfs%252Fnmnm%252Fj0bkrs5%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/2/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/eTPOPgjSfUzcE54cMVOx5_ZH_Sx5_Pme_ECXqnIh5GE%3D279&amp;source=gmail&amp;ust=1671629384634000&amp;usg=AOvVaw3THsFNPuFUvR6flSUmLo_h">
	  <span style="text-decoration:none;color:#1b2426">${comment.content}</span>
	  </a>
	  </td>
	  </tr>
	  <tr>
	  <td align="center">
	  <table width="180" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8901276260374497905btn-14" bgcolor="#0079d3" style="border-radius:4px;font-size:14px;line-height:18px;color:#ffffff;font-family:Helvetica,Arial,sans-serif;text-align:center;min-width:auto!important">
	  <a style="display:block;padding:8px;text-decoration:none;color:#ffffff" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Fu_RequirementOrnery717%252Fcomments%252Fzmlbfs%252Fnmnm%252Fj0bkrs5%252F%253F$deep_link%3Dtrue%2526correlation_id%3D2c447f12-3bc5-44bb-9f43-9109fe4facf2%2526ref%3Demail_post_reply%2526ref_campaign%3Demail_post_reply%2526ref_source%3Demail/3/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/aWOaHB3N9P2ZsKnhguwIskSGCJvqJ1ezn1wMR0TkqqQ%3D279&amp;source=gmail&amp;ust=1671629384634000&amp;usg=AOvVaw0TTHAAcaOCB6UreGcXpSg3">
	  <span style="text-decoration:none;color:#ffffff">
	  <strong>
	  View Reply
	  </strong>
	  </span>
	  </a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  
	  
	  <tr>
	  <td class="m_8901276260374497905mpt-16 m_8901276260374497905mpt-34" style="padding-top:48px" bgcolor="#f2f5f6">
	  <table width="100%" cellspacing="0" cellpadding="0" border="0">
	  <tbody>
	  <tr>
	  <td class="m_8901276260374497905w-104 m_8901276260374497905mpb-20" style="font-size:0pt;line-height:0pt;text-align:center;padding-bottom:28px"><a href="https://click.redditmail.com/CL0/https:%2F%2Fwww.reddit.com%2F/2/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/5wnSmpQZ-3rLOvb7Wj9Zkst9sMn9PTQr9K1Z-4jJ8DM=279" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252F/2/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/5wnSmpQZ-3rLOvb7Wj9Zkst9sMn9PTQr9K1Z-4jJ8DM%3D279&amp;source=gmail&amp;ust=1671629384634000&amp;usg=AOvVaw0BV12vbvk4ZXXBcwiyt0CA"><img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" alt="" width="115" height="40" border="0" class="CToWUd" data-bit="iit"></a></td>
	  </tr>
	  <tr>
	  <td style="padding-bottom:20px" align="center">
	  <table cellspacing="0" cellpadding="0" border="0">
	  <tbody>
	  <tr>
	  <td class="m_8901276260374497905w-114" style="font-size:0pt;line-height:0pt;text-align:left" valign="top"><a target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fapps.apple.com%252Fus%252Fapp%252Freddit%252Fid1064216828/1/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/9sDuro5dHiyH2w8w2Bt80nxTf0iX7U_Ojohp1gxmpn0%3D279&amp;source=gmail&amp;ust=1671629384634000&amp;usg=AOvVaw1-io49Br3HwGdk4ihGH9lA"><img src="https://ci3.googleusercontent.com/proxy/LECwhMZFS7zsvkAGgSy-KFmOiIBWQlC-xrIPw1wOhWgGgQSQiVO30RU9GoxwCBGfzsIS4mjH10YiMkpklZrrScGHBUWjL_PRkpulIE0=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/app_store_8_8.png" alt="" width="124" height="37" border="0" class="CToWUd" data-bit="iit"></a></td>
	  <td class="m_8901276260374497905w-8" style="font-size:0pt;line-height:0pt;text-align:left" width="10"></td>
	  <td class="m_8901276260374497905w-114" style="font-size:0pt;line-height:0pt;text-align:left" valign="top"><a target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fplay.google.com%252Fstore%252Fapps%252Fdetails%253Fid%3Dcom.reddit.frontpage/1/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/Uc1u0yWIFtjVvUcfJUcLfMcFJw7g2l-K-6ieRaPMICQ%3D279&amp;source=gmail&amp;ust=1671629384634000&amp;usg=AOvVaw2wTEgi1hlshFwMRrLdAyEy"><img src="https://ci6.googleusercontent.com/proxy/Uc8pkryaoD6Czm6F_Q53DFW4z8ZiTW0fKGCBzPWMMi4y-LjuGAwkZJ3AUbDsFW6b06b8BYk01LzdBZgHJxbIj23Qq77lDt7IPQtKVqg0RA=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/google_play_8_8.png" alt="" width="124" height="37" border="0" class="CToWUd" data-bit="iit"></a></td>
	  </tr>
	  </tbody>
	  </table>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8901276260374497905mpx-12 m_8901276260374497905mpb-20" style="padding-bottom:20px;padding-left:24px;padding-right:24px">
	  <table width="100%" cellspacing="0" cellpadding="0" border="0">
	  <tbody>
	  <tr>
	  <td class="m_8901276260374497905mfz-12 m_8901276260374497905mlh-18" style="font-size:16px;line-height:18px;color:#687981;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;text-align:center">
	  This email was intended for u/${user.username}. <a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#006cbf" target="_blank" ><span style="text-decoration:none;color:#006cbf">Unsubscribe</span></a> from post reply messages, or visit your settings to manage what emails <span class="il">Reddit</span> sends you.
	  </td>
	  </tr>
	  </tbody>
	  </table>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8901276260374497905mfz-12 m_8901276260374497905mlh-18 m_8901276260374497905mpx-12" style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;min-width:auto!important;color:#222222;text-align:center;padding-left:24px;padding-right:24px">Faculty Of Engineering Cairo University</td>
	  </tr>
	  <tr>
	  <td class="m_8901276260374497905fluid-img" style="font-size:0pt;line-height:0pt;text-align:left"><img src="https://ci6.googleusercontent.com/proxy/jWfzz4U5cA7v4v6I67-jPvk1tWtaxG7FIdD5c4vPlN6oN2aE19dNtG_LHwjd4gO74oke1BW0gjfMSvccRwYn3BTD8pc0421hpY_NLFBnJw=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/footer_logo_8_8.png" alt="" width="600" height="115" border="0" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 552px; top: 905px;"><div id=":18b" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Download attachment " jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB" data-tooltip-class="a1V" data-tooltip="Download"><div class="akn"><div class="aSK J-J5-Ji aYr"></div></div></div></div></td>
	  </tr>
	  </tbody>
	  </table>
	  </td>
	  </tr>
	  
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </center>
	  <img alt="" src="https://ci6.googleusercontent.com/proxy/sdgRF00cPunpVXHQzAKLz0rxW6kvO6u9SAnRnr7NzLAZkkP35ce-icK6lHzelrWbXGT2BAuVS_wRRVnWuMQDY-pJMnt-jboIaSGRDsywsjlQD548FhYXuWiqjB_C1i1KueQhPKKwwp1l15r4LKLuaSGIh0DEUXioYjQuayKO6EuhEtbP4ZvQdZ14Ois8zMajL8NJtsZDrNYcZqSM0QFMUw=s0-d-e1-ft#http://click.redditmail.com/CI0/0100018516049010-d6d334e3-db70-4b59-9658-dfccda093d98-000000/nV7_UyqcxMbUQaQusDsr4K_vFyEzGeA_PZ8lJ_tiWXY=279" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit"><div class="yj6qo"></div><div class="adL">
	  </div></div><div class="adL">
	  
	  
	  </div></div></div><div id=":17w" class="ii gt" style="display:none"><div id=":17x" class="a3s aiL "></div></div><div class="hi"></div></div>
		  `,
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function sendMentionMail(user, post, comment) {
  try {
    let postPlace;
    if (post.subreddit) {
      postPlace = post.subreddit;
    } else {
      postPlace = "u_" + post.ownerUsername;
    }
    const commentWriter = await User.find({ username: comment.username });
    const picture = commentWriter.picture;
    mg.messages().send({
      from: SENDER_EMAIL,
      to: user.email,
      subject: `u/${comment.ownerUsername} mentioned you in r/${postPlace}`,
      html: `
	  <div class=""><div class="aHl"></div><div id=":1ap" tabindex="-1"></div><div id=":1bi" class="ii gt" jslog="20277; u014N:xr6bB; 4:W251bGwsbnVsbCxbXV0."><div id=":1bj" class="a3s aiL "><u></u>
	  <div style="padding:0!important;margin:0 auto!important;display:block!important;min-width:100%!important;width:100%!important;background:#ffffff">
	  <center>
	  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100%" bgcolor="#ffffff">
	  <tbody><tr>
	  <td style="margin:0;padding:0;width:100%" align="center">
	  <table width="600" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="width:600px;min-width:600px;font-size:0pt;line-height:0pt;padding:0;margin:0;font-weight:normal">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  
	  
	  <tbody><tr>
	  <td style="padding-left:32px;padding-right:32px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="border-bottom:1px solid #ebeef0;padding-top:16px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="padding-bottom:55px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td width="112" style="font-size:0pt;line-height:0pt;text-align:left">
	  <a href="${FRONT_BASE}/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252F/1/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/svqCiO4D0440dnp6QUrIX7CbvXw51ghEmd-_XiUTApQ%3D279&amp;source=gmail&amp;ust=1671639394563000&amp;usg=AOvVaw1cc0yP-3L7FY8BAXmleB_s"><img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" width="112" height="39" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  <td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td style="font-size:0pt;line-height:0pt;text-align:left">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td align="right">
	  <table border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td width="16" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><img src="${FRONT_BASE}/api/${user.avatar}" width="16" height="16" border="0" alt="" class="CToWUd" data-bit="iit"></td>
	  <td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299">
	  <a href="${FRONT_BASE}/user/${user.username}" style="text-decoration:none;color:#7a9299" target="_blank" >
	  <span style="text-decoration:none;color:#7a9299">u/${user.username}</span>
	  </a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td style="font-size:0pt;line-height:0pt;text-align:center;padding-bottom:14px">
	  <a href="${FRONT_BASE}/user/${comment.ownerUsername}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FBlaze428%252F%253F$deep_link%3Dtrue%2526correlation_id%3D101e32a6-615c-49ee-a9de-ca773b6d724c%2526ref%3Demail_username_mention%2526ref_campaign%3Demail_username_mention%2526ref_source%3Demail/1/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/EimfTNnxU2zNi3gfYHVhVMXsy10Lv_ZU2u9r0alAMhc%3D279&amp;source=gmail&amp;ust=1671639394563000&amp;usg=AOvVaw1SOeyIwzwNwZVfUN-VvZkv">
	  <div style="border:1px solid #edeff1;border-radius:50%;margin:auto;width:88px;height:88px;background-position:center;background-repeat:no-repeat;background-size:100% 100%;background-image:url('${FRONT_BASE}/api/${picture}')">
	  <img src="https://ci4.googleusercontent.com/proxy/PbpuW5kvnuSr8IuqpPOoC96AOHRw_X93oPjIDJ5ZNhbwUSaNFw69sBm0mwEAIh79Ae5fb7XynIQkgF98rWuzDZCSPyGoDRN3uyOGR6bGuIVEi6UX9t28-Q=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/username_mention_icon@4x.png" alt="" style="border:0;width:41px;height:41px;padding-top:56px;padding-left:56px" class="CToWUd" data-bit="iit">
	  </div>
	  </a>
	  </td>
	  </tr>
	  <tr>
	  <td style="font-size:20px;line-height:23px;color:#313e42;font-family:Helvetica,Arial,sans-serif;font-weight:normal;min-width:auto!important;text-align:center;padding-bottom:18px">
	  <a href="${FRONT_BASE}/user/${comment.ownerUsername}" style="text-decoration:none;color:#006cbf" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FBlaze428%252F%253F$deep_link%3Dtrue%2526correlation_id%3D101e32a6-615c-49ee-a9de-ca773b6d724c%2526ref%3Demail_username_mention%2526ref_campaign%3Demail_username_mention%2526ref_source%3Demail/2/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/GakjsJJxTjYNK6ri05HvyFJnnGnm6MrOjR3Q_y5RdT8%3D279&amp;source=gmail&amp;ust=1671639394563000&amp;usg=AOvVaw33f7F0ldbuL0QrZ2IGGZGg">
	  <span style="text-decoration:none;color:#006cbf">
	  <strong>
	  <span style="color:#006cbf">u/${comment.ownerUsername}</span>
	  </strong>
	  </span>
	  </a>
	  mentioned you in
	  <span><br></span>
	  <span style="text-decoration:none;color:#313e42">r/${postPlace}</span>
	  </a>
	  <span style="color:#a7b4b8">· </span>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td style="padding-top:24px;padding-bottom:48px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="padding-bottom:8px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td width="32" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><img src="${FRONT_BASE}/api/${picture}" width="32" height="32" style="border-radius:50%" border="0" alt="" class="CToWUd" data-bit="iit"></td>
	  <td width="8" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td style="font-size:14px;line-height:16px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#1b2426">
	  <span style="text-decoration:none;color:#1b2426">
	  <strong>r/${postPlace}</strong>
	  </span>
	  </a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td style="font-size:18px;line-height:21px;font-weight:700;font-style:normal;color:#1b2426;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;padding-bottom:0px">
	  <a <span style="text-decoration:none;color:#1b2426"><strong>${comment.content}</strong></span></a>
	  </td>
	  </tr>
	  
	  <tr>
	  <td style="padding-top:8px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="padding-bottom:24px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td align="left">
	  <table border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td align="left" valign="top">
	  <table border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td bgcolor="#f7fbfc" style="border-radius:20px;padding-top:8px;padding-bottom:8px;padding-left:8px;padding-right:8px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td width="20" style="font-size:0pt;line-height:0pt;text-align:left">
	  <a target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Flearnprogramming%252Fcomments%252Fzltmxa%252Fschool_offers_a_cc_path_and_a_java_path_which_one%252Fj0bl83f%252F%253F$deep_link%3Dtrue%2526correlation_id%3D101e32a6-615c-49ee-a9de-ca773b6d724c%2526ref%3Demail_username_mention%2526ref_campaign%3Demail_username_mention%2526ref_source%3Demail/2/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/hWo_s22JYK_666JrK6Q1Ftt0wOOufGcu49JVwUCNICU%3D279&amp;source=gmail&amp;ust=1671639394564000&amp;usg=AOvVaw1wqWMzAepUAD3v_lPghrjP"><img src="https://ci6.googleusercontent.com/proxy/SH15sccj2d1z89tsSzQ-Z0I9Fech-Cy1orQOdInXAplZVBPFiJAqIW5vP-QLbGNdriZhaEkLWldCq3uIK0oQ3_5Uz1wYm2StD3oq=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/upvote_icon.png" width="20" height="20" border="0" alt="" class="CToWUd" data-bit="iit"></a>
      </td>
	  <td width="8" style="font-size:0pt;line-height:0pt;text-align:left">
	  </td>
	  <td style="font-size:14px;line-height:18px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#485b61">
	  <span style="text-decoration:none;color:#485b61">
	  <strong>${comment.numberOfVotes}</strong>
	  </span>
	  </a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  <td width="14" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td align="left" valign="top">
	  <table border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td bgcolor="#f7fbfc" style="border-radius:20px;padding-top:8px;padding-bottom:8px;padding-left:8px;padding-right:8px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td width="20" style="font-size:0pt;line-height:0pt;text-align:left">
	  <a target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Flearnprogramming%252Fcomments%252Fzltmxa%252Fschool_offers_a_cc_path_and_a_java_path_which_one%252Fj0bl83f%252F%253F$deep_link%3Dtrue%2526correlation_id%3D101e32a6-615c-49ee-a9de-ca773b6d724c%2526ref%3Demail_username_mention%2526ref_campaign%3Demail_username_mention%2526ref_source%3Demail/4/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/HWpmMKA014HK2M9QlGV6XYb6ZjxKfFKgfu4jcvh_kog%3D279&amp;source=gmail&amp;ust=1671639394564000&amp;usg=AOvVaw0S7SQZaLsRHRsWr3MG2vcx"><img src="https://ci4.googleusercontent.com/proxy/ojGsoeblJDHdVA3JComw19YUMGSxOAJP9hTyZJQd3dHjsShSuPopSkUqXkk34jhmPb2-5zmh1V3aBPt9TfgMiBDI47TimYwDxabbNw=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/comment_icon.png" width="20" height="19" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  <td width="8" style="font-size:0pt;line-height:0pt;text-align:left">
	  </td>
	  <td style="font-size:14px;line-height:18px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#485b61">
	  <a style="text-decoration:none;color:#485b61" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Flearnprogramming%252Fcomments%252Fzltmxa%252Fschool_offers_a_cc_path_and_a_java_path_which_one%252Fj0bl83f%252F%253F$deep_link%3Dtrue%2526correlation_id%3D101e32a6-615c-49ee-a9de-ca773b6d724c%2526ref%3Demail_username_mention%2526ref_campaign%3Demail_username_mention%2526ref_source%3Demail/3/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/qBpyz7NP465dsZ0DPvdlHy57sZwWNdUud64ZoabMqZo%3D279&amp;source=gmail&amp;ust=1671639394564000&amp;usg=AOvVaw1S0k6v8pAq5GN0TLoFmDE5">
	  <span style="text-decoration:none;color:#485b61">
	  <strong>${post.numberOfComments}</strong>
	  </span>
	  </a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  <td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td align="right" width="52">
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td align="center">
        <table width="180" border="0" cellspacing="0" cellpadding="0">
        <tbody><tr>
        <td bgcolor="#0079d3" style="border-radius:4px;font-size:14px;line-height:18px;color:#ffffff;font-family:Helvetica,Arial,sans-serif;text-align:center;min-width:auto!important">
        <a href="${FRONT_BASE}" style="display:block;padding:8px;text-decoration:none;color:#ffffff" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fr%252Flearnprogramming%252Fcomments%252Fzltmxa%252Fschool_offers_a_cc_path_and_a_java_path_which_one%252Fj0bl83f%252F%253F$deep_link%3Dtrue%2526correlation_id%3D101e32a6-615c-49ee-a9de-ca773b6d724c%2526ref%3Demail_username_mention%2526ref_campaign%3Demail_username_mention%2526ref_source%3Demail/6/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/45txkkwd4NLUtcm8e7TLsBL_YRpCJWeGAewDEcOvDeQ%3D279&amp;source=gmail&amp;ust=1671639394564000&amp;usg=AOvVaw05T71sUR9qXuWuUb7WNeRR">
        <span style="text-decoration:none;color:#ffffff">
        <strong>Reply</strong>
	  </span>
	  </a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  
	  
	  
	  <tr>
	  <td bgcolor="#f1f5f6" style="padding-bottom:28px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="font-size:0pt;line-height:0pt;text-align:left;padding-bottom:0px">
	  <a target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252F/2/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/YaPot2XsQRsmkRkCzLqhDlheY3bsyrxSEBr9N_HucEk%3D279&amp;source=gmail&amp;ust=1671639394564000&amp;usg=AOvVaw0UPmOp1PNO-oWncd0FbMPb"><img src="https://ci4.googleusercontent.com/proxy/Flb5Y5Y-P6rvdRZv0owO2as9IRP-Os3S3vxeJimvST-JKs-9lrCr6OuH1685ql8qDSuMfldFHNEz6cpcRuyI2xVNzGDu5SRwXq1EfFp_KQ=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/email_footer@2x.png" width="600" height="126" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  </tr>
	  <tr>
	  <td align="center" style="padding-bottom:19px">
	  <table border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td valign="top" style="font-size:0pt;line-height:0pt;text-align:left">
	  <a target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Freddit.app.link%252F%253Faction%3Dclick%2526publisher_id%3D293679%2526site_id%3D122129%2526site_id_ios%3D121809%2526utm_content%3Dinstall_app/1/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/cPtbVkUXQk2PnacaUoj6y94ra2hEmT6vwnb-0bkoRLc%3D279&amp;source=gmail&amp;ust=1671639394564000&amp;usg=AOvVaw2ndw0X4Oj4Vi-McwfM2smf"><img src="https://ci3.googleusercontent.com/proxy/WCfQhJ75f51I8PenoK_3M5aYD-BJgHiZ__GdcoDoFmT4CF2eRkiYtrLn4iM9MENRYBAR7DzBe4qPytr0PZ_8jTlsfKsGkXFpo_aTJprPNBmv=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/button_applestore.png" width="119" height="38" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  <td width="10" style="font-size:0pt;line-height:0pt;text-align:left">
	  </td>
	  <td valign="top" style="font-size:0pt;line-height:0pt;text-align:left">
	  <a  target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Freddit.app.link%252F%253Faction%3Dclick%2526publisher_id%3D293679%2526site_id%3D122129%2526site_id_ios%3D121809%2526utm_content%3Dinstall_app/2/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/ZHu4BGBgFJQtNoR0dgin4jg6DqKZ2thbmnD8v9Sb2yQ%3D279&amp;source=gmail&amp;ust=1671639394564000&amp;usg=AOvVaw3qu_WfJ5XdbhDlww4whFJn"><img src="https://ci5.googleusercontent.com/proxy/8T1diAP66cNDS8iGt6hA-5N19ln1wIYvYT2cOIC-rV_d0UOApdO3iQFNNoOnvbhqNPfoJBdb23rI1jQM_4SwnY6SBa-VYPaEaxab3r0qcHim=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/button_googleplay.png" width="119" height="38" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td style="padding-bottom:30px;padding-left:81px;padding-right:64px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;font-style:normal;font-weight:400;min-width:auto!important;text-align:center;color:#687981">
	  This email was intended for u/${user.username}. <a style="text-decoration:none;color:#006cbf" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fmail%252Funsubscribe%252F9qajrecy%252F5%252Fe3909c444b3bc442e07a01a3088b5e0311d4113fe6bba4f3c3b52479a1803446%253F$web_only%3Dtrue%2526correlation_id%3D101e32a6-615c-49ee-a9de-ca773b6d724c%2526ref%3Demail_username_mention%2526ref_campaign%3Demail_username_mention%2526ref_source%3Demail%2526utm_content%3Dunsubscribe/1/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/Or692epHKokwPEdxnCka2rvchYXRdDmtkLT9SvrXxec%3D279&amp;source=gmail&amp;ust=1671639394564000&amp;usg=AOvVaw2uyNNQHRrjlhRUYtjNQdxF"><span style="text-decoration:none;color:#006cbf">Unsubscribe</span></a> from username mention messages, or visit your settings to manage what emails <span class="il">Reddit</span> sends you.
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;font-style:normal;font-weight:400;min-width:auto!important;color:#222222;text-align:center;padding-left:53px;padding-right:36px">
	  Faculty Of Engineering Cairo University</td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </center>
	  <img alt="" src="https://ci4.googleusercontent.com/proxy/UGNdR4aGFt4W17ncL6fhzy8InqTEvG5V7M_yVZk9bVkdQXk60pNgXSe8bX_PbZ192X5L7YBQ3LxwhnCuiDfadr9PSSLvbwEFEwCRMMIz8KApOvW_tYSicMMeiCmhTmL-dZ12llM_GYTDg9vnemS4BZZIjPLc-qSB6fsV7f0GVppdKYvHDVvWUHQVQriEmcqzLuF24JPdDqz0bTVOhMFIFA=s0-d-e1-ft#http://click.redditmail.com/CI0/010001851607fcfd-b5ed1c5b-ecc5-4e9a-a879-1c014a7c0445-000000/FZokUY2zTRrStV0_CuP8niBT2Ig5ki83_UDBcHI_TkE=279" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit"><div class="yj6qo"></div><div class="adL">
	  </div></div><div class="adL">`,
    });
    return true;
  } catch (err) {
    return false;
  }
}

export async function sendMessageMail(user, message) {
  try {
    const sender = await User.find({ username: message.senderUsername });
    const picture = sender.picture;
    let senderIndicator;
    if (message.isSenderUser) {
      senderIndicator = "u";
    } else {
      senderIndicator = "r";
    }
    mg.messages().send({
      from: SENDER_EMAIL,
      to: user.email,
      subject: `New message from ${senderIndicator}/${message.senderUsername}`,
      html: `
	  <div class=""><div class="aHl"></div><div id=":1at" tabindex="-1"></div><div id=":1c8" class="ii gt" jslog="20277; u014N:xr6bB; 4:W251bGwsbnVsbCxbXV0."><div id=":1c9" class="a3s aiL msg8747937118570989382"><u></u>
	  <div class="m_8747937118570989382body" style="padding:0!important;margin:0 auto!important;display:block!important;min-width:100%!important;width:100%!important;background:#ffffff">
	  <center>
	  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100%" bgcolor="#ffffff" class="m_8747937118570989382gwfw">
	  <tbody><tr>
	  <td style="margin:0;padding:0;width:100%" align="center">
	  <table width="600" border="0" cellspacing="0" cellpadding="0" class="m_8747937118570989382m-shell">
	  <tbody><tr>
	  <td class="m_8747937118570989382td" style="width:600px;min-width:600px;font-size:0pt;line-height:0pt;padding:0;margin:0;font-weight:normal">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  
	  
	  <tbody><tr>
	  <td style="font-size:0pt;line-height:0pt;text-align:left">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8747937118570989382mpx-16" style="padding-left:32px;padding-right:32px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="border-bottom:1px solid #ebeef0;padding-top:16px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8747937118570989382mpb-48" style="padding-bottom:55px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8747937118570989382w-104" width="112" style="font-size:0pt;line-height:0pt;text-align:left"><a href="${FRONT_BASE}/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252F/1/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/XQvijQ1dfO6dKw0JnB2fsKvl1Jmsph9UQvtVt35s_QQ%3D279&amp;source=gmail&amp;ust=1671649120785000&amp;usg=AOvVaw2kn3UFmgYS0RTZtdIXCkxb"><img src="https://ci4.googleusercontent.com/proxy/ek_YRst9zhrJAPOUNmdD7HcqXKAwKpnhjx-qvaID79g0_xu34epyVQCXQT76z3cp3KKi-COutsgegnXI5R4rXZNNhwb5HDo=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/logo@2x.png" width="112" height="39" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  <td width="20" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td style="font-size:0pt;line-height:0pt;text-align:left">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td align="right">
	  <table border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td width="16" valign="top" style="font-size:0pt;line-height:0pt;text-align:left"><img src="${FRONT_BASE}/api/{user.avatar}" width="16" height="16" border="0" alt="" class="CToWUd" data-bit="iit"></td>
	  <td width="4" style="font-size:0pt;line-height:0pt;text-align:left"></td>
	  <td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299">
	  <a href="${FRONT_BASE}/user/${message.receiverUsername}" style="text-decoration:none;color:#7a9299" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FRequirementOrnery717%252F%253F$deep_link%3Dtrue%2526correlation_id%3Dd9140790-189b-4c6a-90f7-50c47b819b5f%2526ref%3Demail_private_message%2526ref_campaign%3Demail_private_message%2526ref_source%3Demail/1/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/liHDLYzKjyrrDoVBEuosdvyJL6FRii-WKazvnfasno8%3D279&amp;source=gmail&amp;ust=1671649120785000&amp;usg=AOvVaw0tjZOObYNIH5wcawABSj8h"><span style="text-decoration:none;color:#7a9299">u/${message.receiverUsername}</span></a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td style="font-size:0pt;line-height:0pt;text-align:center;padding-bottom:14px">
	  <a href="${FRONT_BASE}/user/${message.senderUsername}" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FBlaze428%252F%253F$deep_link%3Dtrue%2526correlation_id%3Dd9140790-189b-4c6a-90f7-50c47b819b5f%2526ref%3Demail_private_message%2526ref_campaign%3Demail_private_message%2526ref_source%3Demail/1/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/hsh81Pt2VWAdUOLHHVydT15Ur400eXDbVkvEOVmawWM%3D279&amp;source=gmail&amp;ust=1671649120785000&amp;usg=AOvVaw3FWSaEqnb54bBfMZtww0gZ">
	  <div style="border:1px solid #edeff1;border-radius:50%;margin:auto;width:88px;height:88px;background-position:center;background-repeat:no-repeat;background-size:100% 100%;background-image:url('${FRONT_BASE}/api/${picture}')">
	  <img src="https://ci3.googleusercontent.com/proxy/Cobf4p_lbXplTO8od-xD6o0eE8psBeG0f5k7IEgPWyE9jDHylpFPk2vK7C0xX8Bg6hQSPDzE2QHa_z4fvnFIJuf2QbDqe2NumccKn7Z6TwwTHOWBOrlH=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/private_message_icon@4x.png" alt="" style="border:0;width:41px;height:41px;padding-top:56px;padding-left:56px" class="CToWUd" data-bit="iit">
	  </div>
	  </a>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8747937118570989382mfz-16 m_8747937118570989382mlh-18 m_8747937118570989382mpb-27 m_8747937118570989382mpb-20" style="font-size:20px;line-height:23px;color:#313e42;font-family:Helvetica,Arial,sans-serif;font-weight:normal;min-width:auto!important;text-align:center;padding-bottom:28px">
	  You have a new message from <a href="${FRONT_BASE}/user/${message.senderUsername}" style="text-decoration:none;color:#006cbf" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FBlaze428%252F%253F$deep_link%3Dtrue%2526correlation_id%3Dd9140790-189b-4c6a-90f7-50c47b819b5f%2526ref%3Demail_private_message%2526ref_campaign%3Demail_private_message%2526ref_source%3Demail/2/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/a_WU7fn-rndfIu7uuBEhhmX9ItAJwmWOR5xs5UBAcFk%3D279&amp;source=gmail&amp;ust=1671649120785000&amp;usg=AOvVaw0PpbzpQvXV1oYYdNOMQbOF"><span style="text-decoration:none;color:#006cbf"><strong style="color:#006cbf">${senderIndicator}/${message.senderUsername}</strong></span></a>
	  <span style="color:#a7b4b8">· </span></td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8747937118570989382mpt-8 m_8747937118570989382mpb-12" style="padding-top:8px;padding-bottom:48px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td style="font-size:12px;line-height:14px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#7a9299;padding-bottom:4px;font-style:normal;font-weight:400">
	  <a href="${FRONT_BASE}/user/${message.senderUsername}" style="text-decoration:none;color:#7a9299" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fuser%252FBlaze428%252F%253F$deep_link%3Dtrue%2526correlation_id%3Dd9140790-189b-4c6a-90f7-50c47b819b5f%2526ref%3Demail_private_message%2526ref_campaign%3Demail_private_message%2526ref_source%3Demail/3/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/Eh4f2yNp5IyOLgLnbmCWjjsqSgaZH80jh1rVFILK3w0%3D279&amp;source=gmail&amp;ust=1671649120785000&amp;usg=AOvVaw3OI_B2TVeclmwNCYOVKEEH"><span style="text-decoration:none;color:#7a9299">${senderIndicator}/${message.senderUsername}</span></a>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8747937118570989382mpb-28 m_8747937118570989382mfz-14 m_8747937118570989382mlh-18" style="font-size:16px;line-height:21px;font-family:Helvetica,Arial,sans-serif;text-align:left;min-width:auto!important;color:#1b2426;padding-bottom:35px;font-style:normal;font-weight:400">
	  <a style="text-decoration:none;color:#1b2426" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fmessage%252Fmessages%252F1o1r83a%253F$deep_link%3Dtrue%2526correlation_id%3Dd9140790-189b-4c6a-90f7-50c47b819b5f%2526ref%3Demail_private_message%2526ref_campaign%3Demail_private_message%2526ref_source%3Demail/1/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/gssudT67IZNlORef-0FqU0QpS4aqgmgmKVTXVGK6Nic%3D279&amp;source=gmail&amp;ust=1671649120785000&amp;usg=AOvVaw3fzw9bHyhdSbbH7motsENt"><span style="text-decoration:none;color:#1b2426"><p>${message.text}</p></span></a>
	  </td>
	  </tr>
	  <tr>
	  <td align="center">
	  <table width="180" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8747937118570989382btn-14" bgcolor="#0079d3" style="border-radius:4px;font-size:14px;line-height:18px;color:#ffffff;font-family:Helvetica,Arial,sans-serif;text-align:center;min-width:auto!important">
	  <a href="${FRONT_BASE}/" style="display:block;padding:8px;text-decoration:none;color:#ffffff" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fmessage%252Fmessages%252F1o1r83a%253F$deep_link%3Dtrue%2526correlation_id%3Dd9140790-189b-4c6a-90f7-50c47b819b5f%2526ref%3Demail_private_message%2526ref_campaign%3Demail_private_message%2526ref_source%3Demail/2/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/vFO5Ny5C9PsSvcs1SfcONLFsYiTo3UwL0hojv0spI7Y%3D279&amp;source=gmail&amp;ust=1671649120785000&amp;usg=AOvVaw2dfN4rPTFYY32vZXaGkiGV"><span style="text-decoration:none;color:#ffffff"><strong>View Message</strong></span></a></td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  
	  
	  
	  <tr>
	  <td class="m_8747937118570989382mpb-20" bgcolor="#f1f5f6" style="padding-bottom:28px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8747937118570989382fluid-img m_8747937118570989382mpb-28" style="font-size:0pt;line-height:0pt;text-align:left;padding-bottom:0px">
	  <a href="${FRONT_BASE}/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252F/2/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/Ppq8R3cXZ57ygEJ9OVEufEps5qnTi_Zyk9riCaBqqYY%3D279&amp;source=gmail&amp;ust=1671649120785000&amp;usg=AOvVaw1BwR1OhIyANiDag8oGXyS2"><img src="https://ci4.googleusercontent.com/proxy/Flb5Y5Y-P6rvdRZv0owO2as9IRP-Os3S3vxeJimvST-JKs-9lrCr6OuH1685ql8qDSuMfldFHNEz6cpcRuyI2xVNzGDu5SRwXq1EfFp_KQ=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/email_footer@2x.png" width="600" height="126" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8747937118570989382mpb-28" align="center" style="padding-bottom:19px">
	  <table border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8747937118570989382w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left">
	  <a  target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Freddit.app.link%252F%253Faction%3Dclick%2526publisher_id%3D293679%2526site_id%3D122129%2526site_id_ios%3D121809%2526utm_content%3Dinstall_app/1/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/2J_ElXcOTrJf4tjL30673u9Ru26aeMjUDWmIFulc06U%3D279&amp;source=gmail&amp;ust=1671649120785000&amp;usg=AOvVaw0Bdjs-PTl98cCLhHCW1mkf"><img src="https://ci3.googleusercontent.com/proxy/WCfQhJ75f51I8PenoK_3M5aYD-BJgHiZ__GdcoDoFmT4CF2eRkiYtrLn4iM9MENRYBAR7DzBe4qPytr0PZ_8jTlsfKsGkXFpo_aTJprPNBmv=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/button_applestore.png" width="119" height="38" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  <td class="m_8747937118570989382w-8" width="10" style="font-size:0pt;line-height:0pt;text-align:left">
	  </td>
	  <td class="m_8747937118570989382w-114" valign="top" style="font-size:0pt;line-height:0pt;text-align:left">
	  <a  target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Freddit.app.link%252F%253Faction%3Dclick%2526publisher_id%3D293679%2526site_id%3D122129%2526site_id_ios%3D121809%2526utm_content%3Dinstall_app/2/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/_9O6E_MY2hjykaNwnROHOsUqC3dafHXAiYcAPsocOjA%3D279&amp;source=gmail&amp;ust=1671649120786000&amp;usg=AOvVaw1G0sozc_YrOGCo72vCHvbW"><img src="https://ci5.googleusercontent.com/proxy/8T1diAP66cNDS8iGt6hA-5N19ln1wIYvYT2cOIC-rV_d0UOApdO3iQFNNoOnvbhqNPfoJBdb23rI1jQM_4SwnY6SBa-VYPaEaxab3r0qcHim=s0-d-e1-ft#https://www.redditstatic.com/emaildigest/button_googleplay.png" width="119" height="38" border="0" alt="" class="CToWUd" data-bit="iit"></a>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8747937118570989382mpx-12 m_8747937118570989382mpb-20" style="padding-bottom:30px;padding-left:81px;padding-right:64px">
	  <table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tbody><tr>
	  <td class="m_8747937118570989382mfz-12 m_8747937118570989382mlh-18" style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;font-style:normal;font-weight:400;min-width:auto!important;text-align:center;color:#687981">
	  This email was intended for u/${message.receiverUsername}. <a href="${FRONT_BASE}/user/${message.receiverUsername}" style="text-decoration:none;color:#006cbf" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://click.redditmail.com/CL0/https:%252F%252Fwww.reddit.com%252Fmail%252Funsubscribe%252F9qajrecy%252F6%252Fe3909c444b3bc442e07a01a3088b5e0311d4113fe6bba4f3c3b52479a1803446%253F$web_only%3Dtrue%2526correlation_id%3Dd9140790-189b-4c6a-90f7-50c47b819b5f%2526ref%3Demail_private_message%2526ref_campaign%3Demail_private_message%2526ref_source%3Demail%2526utm_content%3Dunsubscribe/1/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/-q4ip6vtWHd9aS1AK_MbY9As9g68Naj-Frud9S_Mbdo%3D279&amp;source=gmail&amp;ust=1671649120786000&amp;usg=AOvVaw0gObzAyqoMZstir2pcJerx"><span style="text-decoration:none;color:#006cbf">Unsubscribe</span></a> from private message messages, or visit your settings to manage what emails <span class="il">Reddit</span> sends you.
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  <tr>
	  <td class="m_8747937118570989382mfz-12 m_8747937118570989382mlh-18 m_8747937118570989382mpx-12" style="font-size:16px;line-height:18px;font-family:Helvetica,Arial,sans-serif;font-style:normal;font-weight:400;min-width:auto!important;color:#222222;text-align:center;padding-left:53px;padding-right:36px">
	  Faculty Of Engineering Cairo University</td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </td>
	  </tr>
	  </tbody></table>
	  </center>
	  <img alt="" src="https://ci5.googleusercontent.com/proxy/5Wzb579wm0ou3ckowgWEqgPvNFeoMxVj95s_ksb3VAFJMSmprE2pbID_IVHFiD7AxhUYbXdqE-4DUnv0y_Iu26jIwC23QTKrajSr0f0TyQA37tBJYQh4KHxBX-bSuM60dSJEyDbXc9yPGD-9Z1z_XZN_aFYydFRAMdIhEDWLaYJo4pXKhAKDU9QbMXpil6vruDFXu4MyEokyMmJnO0NThQ=s0-d-e1-ft#http://click.redditmail.com/CI0/010001850ff34349-1e31b7d6-9b09-4ff3-8da1-5311b07711d0-000000/0a_Zb7pRkWgf4TrjOypNWLFzMlTM0j0_IjXq6ZgrT8w=279" style="display:none;width:1px;height:1px" class="CToWUd" data-bit="iit"><div class="yj6qo"></div><div class="adL">
	  </div></div><div class="adL">
	  
	  
	  </div></div></div><div id=":1bv" class="ii gt" style="display:none"><div id=":1bu" class="a3s aiL "></div></div><div class="hi"></div></div>`,
    });
    return true;
  } catch (err) {
    return false;
  }
}
