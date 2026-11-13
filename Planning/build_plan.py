"""Regenerate the Markdown plan, root task list, and PDF with python3 Planning/build_plan.py."""
from pathlib import Path
from datetime import date,timedelta
from html import escape
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle,PageBreak
from reportlab.lib.pagesizes import letter
P=Path(__file__).resolve().parent
names=['Christopher Farah','Eric Braverman','Brayden Molinyawe']
# id, module and task, provisional lead (D0 ownership), workstream, predecessor IDs
tasks=[
('T01','Validate the Database (PostgreSQL) and backend startup from a clean Cadence checkout.',0,'Foundation','—'),
('T02','Obtain a sourced restaurant fixture for the Nutrition Data Importer with calories and serving sizes.',1,'Foundation','—'),
('T03','Develop the Web Frontend (Next.js design) search form against a mocked I5 response.',2,'Foundation','—'),
('T04','Develop Database (PostgreSQL) migrations for restaurant, food item, meal and meal composition.',0,'First search','T01, T02'),
('T05','Develop the Nutrition Data Importer seed path with row validation and atomic writes.',1,'First search','T04'),
('T06','Develop the Web Frontend result list and meal details with keyboard and screen-reader support.',2,'First search','T03'),
('T07','Develop the Food Search API calorie filter, deterministic ranking and closest-option response.',1,'First search','T04'),
('T08','Develop the User Profile API saved-target read and update flow with Keycloak subject checks.',0,'Accounts','T01, T04'),
('T09','Test the Web Frontend against the Food Search API using the 700-calorie acceptance example.',2,'First search','T05, T06, T07'),
('T10','Develop the Nutrition Data Importer preview, confirmation and stale-preview rejection.',1,'Catalog integrity','T05'),
('T11','Develop the User Profile API deletion job, identity cleanup and retry recovery.',0,'Accounts','T08'),
('T12','Develop the Web Frontend save-target, deletion-confirmation and recovery messages.',2,'Accounts','T08, T11'),
('T13','Validate the Nutrition Data Importer USDA grocery mapping against known serving units and missing data.',1,'Catalog integrity','T10'),
('T14','Validate Database (PostgreSQL) backup restoration and deletion replay on an isolated deployment.',0,'Release','T11'),
('T15','Validate the Web Frontend end-to-end demonstration, accessible status messages and two-second search budget.',2,'Release','T09, T12, T13, T14')]
starts=['2026-11-12']*3+['2026-11-20','2026-12-03','2026-11-20','2027-01-11','2027-01-11','2027-01-25','2027-02-01','2027-02-08','2027-02-22','2027-03-01','2027-03-22','2027-04-05']
# Breaks are proposed capacity blackouts; no claim about institution's official dates.
blackouts=[('2026-11-25','2026-11-29'),('2026-12-12','2027-01-10'),('2027-03-08','2027-03-14')]
def six(start):
 d=date.fromisoformat(start);ds=[]
 while len(ds)<6:
  if d.weekday()<5 and not any(a<=str(d)<=b for a,b in blackouts):ds.append(d)
  d+=timedelta(days=1)
 return ds
dates={t[0]:six(s) for t,s in zip(tasks,starts)}
for tid,_,_,_,deps in tasks:
 for dep in deps.split(', '):
  if dep!='—':assert dates[dep][-1]<dates[tid][0],(tid,dep)
hist=[
('H1','2026-09-12','Project description and Christopher bio','9eeff72'),
('H2','2026-09-14','Brayden bio','698d0c0'),
('H3','2026-09-24','Constraints essay and description update','702c713'),
('H4','2026-10-04','User stories/use cases and first D0 design','ae0487f / 0688146'),
('H5','2026-10-21','D0 revision, team contract and MVP backlog','123ab13'),
('H6','2026-10-24','Reusable application template added','7afe150'),
('H7','2026-10-28','Macro scope update and revised backlog','dc6c0b7'),
('H8','2026-11-09','D1/D2 sources and PDFs; peer review still pending','9ef8df1 / 3ee4bf8 / 9624d53'),
('H9','2026-11-10','Cadence starter adaptation on feature/inital-build','6e65ce7'),
('H10','2026-11-12','Ethics statement and attribution review draft (local)','b135bc6 / 091a9ec')]
ms=[
('M1','2026-11-23','Foundation handoff','T01–03: replay setup, inspect fixture and exercise mock search.','Whole team','Nov 20'),
('M2','2026-12-09','Fall / Week 14 review packet (target)','Review schema, seed-import progress, UI and plan tables; reconcile official report date.','Team + advisor invited','Dec 8'),
('M3','2027-01-22','Ranked search and profile contract','Run known search inputs and save/read one target with an authenticated user.','Eric + Christopher','Jan 20–21'),
('M4','2027-02-05','Calorie-search proof of concept','Search 700 kcal; return 680 then 450, exclude 900; inspect meal details.','Brayden + Eric','Feb 3–4'),
('M5','2027-02-19','Catalog and deletion recovery','Reject stale preview; interrupt a deletion, resume it and verify both stores.','Eric + Christopher','Feb 17–18'),
('M6','2027-03-05','Account journey','Save target, sign in again, delete account and observe accessible confirmation.','Brayden + Christopher','Mar 3–4'),
('M7','2027-03-19','Grocery data acceptance','Validate unit conversion and rejection cases against sourced fixtures.','Eric + peer reviewer','Mar 17–18'),
('M8','2027-04-02','Recovery rehearsal','Restore isolated backup and demonstrate that deleted profiles stay deleted.','Christopher + peer reviewer','Mar 31–Apr 1'),
('M9','2027-04-16','Integrated release candidate','Run accessibility, latency and failure checks; record results and limitations.','Whole team','Apr 14–15'),
('M10','2027-04-30','Implementation semester handoff (target)','Repeat accepted demo from documented checkout; review evidence and open issues.','Team + advisor invited','Apr 28–29')]
# Pages are also emitted as Markdown, preserving the rubric order.
pages=[]; page=[]; pages.append(page)
def h(s):page.append(('h',s))
def p(s):page.append(('p',s))
def table(head,rows,widths):page.append(('t',(head,rows,widths)))
def nextpage():
 global page
 page=[];pages.append(page)
h('1. Task List')
p('Assignment 8 · Task Lists (#5) and Milestones, Timeline, and Effort Matrix (#6). Planning baseline: November 12, 2026. Eric Braverman, Brayden Molinyawe, Christopher Farah.')
p('Calorie and Macro Meal Finder. The first release follows the authenticated calorie-only D1/D2 baseline. Macro sorting and guest search require a separate scope decision. Cadence is a starter implementation; D0 names are retained below. Confirm the frontend stack before porting work.')
p('Proposed assignments follow D0 component leads: five tasks per person. They are invitations to own future work, not claims about past effort.')
lines=[f'{i}. {s} Owner: {names[o]}.' for i,s,o,_,_ in tasks]
for l in lines:p(l)
(P.parent/'Tasklist.md').write_text('# Task List — Calorie and Macro Meal Finder\n\nTeam: '+', '.join(names)+'\n\nProposed primary owners; confirm at kickoff.\n\n'+'\n\n'.join(lines)+'\n')
nextpage();h('2. Milestones List | completed evidence')
p('Dates below are Git author dates. “Recorded” means the named artifact was committed; it does not certify course submission, passing tests, or equal authorship. Verify with git show and the indicated commit.')
table(['ID','Recorded','Artifact / outcome','Verification reference'],hist,[34,69,250,150])
p('Christopher: I worked on the early project description, constraints, user stories, D0 and backlog. I stood up the codebase using the starter template (Oct 24) and started adapting it as Cadence (Nov 10). The branch includes landing-page and project changes; a working meal search is not established by that commit.')
p('Eric Braverman — add your own completed contributions, dates and evidence: ____________________.')
p('Brayden Molinyawe — add your own completed contributions, dates and evidence: ____________________.')
p('Course checkpoints: Assignment 8 was due Oct 28; the ethics statement was due Nov 11. Submission status is unverified for both. D2 peer feedback still requires a real review record. No Week 1 course calendar was located; add its other graded dates and replace the Week 14 target with the official date before submission.')
nextpage();h('2. Milestones List | planned demonstrations')
p('These dates are scheduling proposals, not past commitments. Verifiers listed are proposed reviewers. The winter/exam blackout separates fall planning from implementation semester checkpoints.')
table(['ID / target','Outcome','How verified','Verifier'],[(i+' / '+d,n,v,who) for i,d,n,v,who,b in ms],[83,103,215,102])
nextpage();h('3. Table 1 | task timeline')
p('Each task has five scheduled working days plus one task-buffer day (20% of working duration). The last date is that buffer day, not extra estimated labor. Dates exclude weekends and the draft blackouts. Dependencies are finish-to-start. C / E / B = Christopher / Eric / Brayden.')
table(['ID','Task statement','Lead','Start','Finish incl. buffer','Depends on'],[(i,s,'CEB'[o],str(dates[i][0]),str(dates[i][-1]),dep) for i,s,o,_,dep in tasks],[28,235,33,68,68,60])
p('Calendar driver into the final demonstration: T01/T02 → T04 → T08 → T11 → T14 → T15 → M9. T13 also gates T15; holiday and owner availability can consume the gaps. Confirm this chain after owners supply estimates.')
nextpage();h('3. Table 1 | milestone dates and protected time')
table(['ID','Milestone','Recorded / planned date','Protected review block'],[(i,n,d,'Historical record') for i,d,n,_ in hist]+[(i,n,d,b) for i,d,n,_,_,b in ms],[35,249,103,116])
p('Protected dates are reserved for milestone verification or recovery, not new feature commitments. Proposed blackouts: Nov 25–29; Dec 12–Jan 10 for exams/winter break; Mar 8–14 pending spring availability. Confirm co-op/exam schedules at kickoff; keep semester-end exam time outside the Apr 30 handoff.')
nextpage();h('4. Table 2 | effort matrix')
p('Proposed allocation of each task’s effort (%), not hours worked or owner estimates. Asterisk marks its sole primary owner. Equal-sized tasks give a balanced initial allocation; use weighted hours once estimates arrive.')
rr=[];tot=[0,0,0]
for i,s,o,_,_ in tasks:
 a=[20,20,20];a[o]=60;tot=[x+y for x,y in zip(tot,a)];rr.append([i,s]+[str(x)+('*' if k==o else '') for k,x in enumerate(a)]+['100'])
table(['ID','Task statement','Chris %','Eric %','Brayden %','Total %'],rr+[['Total','Sum across 15 tasks']+list(map(str,tot))+['1500']],[30,245,53,48,68,55])
p('Each column totals 500 percentage points (one third of equal-weight capacity). Each owner should supply optimistic, most likely and pessimistic hours. Compute expected task hours = (O + 4M + P) / 6 and multiply by each share. If actual weekly demand exceeds declared capacity, move review/testing hours to the available teammate or resequence before consuming protected time.')
nextpage();h('5. Work breakdown structure')
for phase in dict.fromkeys(t[3] for t in tasks):
 p(phase.upper())
 for i,s,o,ph,_ in tasks:
  if ph==phase:p(i+' · '+s+' '+names[o]+'.')
nextpage();h('6. Risk register')
p('Discussion draft: these triggers and responses are grounded in D1/D2 and the schedule. Owners must assess likelihood/impact and adopt or revise each response; the entries do not attest to a team risk vote.')
table(['Risk / category','Likelihood / impact¹','Trigger','Proposed strategy and mitigation','Lead / checkpoint'],[
['Startup drift · technical','Open / high','Clean checkout fails or auth/stack differs from D2.','Reduce: document exact branch, versions and failing step; agree the auth boundary before integration.','Chris · T01/M1'],
['Nutrition coverage · external','Open / high','Source lacks serving basis or permission.','Reduce: switch to verified fixture; defer unverified rows and keep their provenance.','Eric · T02/M1; T13/M7'],
['Stale changes · technical','Open / high','Second preview overwrites a newer import.','Reduce: test version conflict and unchanged live rows before accepting importer.','Eric · T10/M5'],
['Recovery failure · technical','Open / high','Restoration recreates a deleted profile.','Avoid release until replay and isolated restore pass. Use M8 buffer for a repeat run.','Chris · T14/M8'],
['Availability · team','Open / high','Exam, co-op rotation or break removes an owner during a task.','Reduce: collect blackout dates at kickoff; name a backup reviewer and move dependent work before protected blocks.','Brayden · M1/M2/M7'],
['Slow or inaccessible results · technical','Open / high','Search exceeds two seconds or result labels fail screen-reader check.','Reduce: measure fixture end to end at M4; reserve M9 block for regression.','Brayden · T09/T15'],
],[85,65,101,168,84])
p('¹ High is a proposed schedule consequence, not an owner assessment of probability. Record the team’s likelihood and impact ratings before submission.')
p('This week · Thu Nov 12: Chris records Cadence setup and a health check; Eric identifies a source and fixture; Brayden sketches the accessible target/results flow. Fri Nov 13: agree I5 request/response and exchange artifacts. By Sun Nov 15: each member posts progress, blockers, task estimates, availability and ownership changes for the weekly check-in. Next week: use the artifacts to verify M1.')
md=['# Assignment 8 — implementation plan']
for pg in pages:
 for kind,data in pg:
  if kind=='t':
   head,rows,w=data;md+=['| '+' | '.join(head)+' |','| '+' | '.join(['---']*len(head))+' |']+['| '+' | '.join(row)+' |' for row in rows]+['']
  else:md+=[('## ' if kind=='h' else '')+data,'']
(P/'Implementation_Plan.md').write_text('\n'.join(md)+'\n')
def para(txt,sz=10,bold=False,color='#163444'):
 return Paragraph(escape(txt),ParagraphStyle('p',fontName='Helvetica-Bold' if bold else 'Helvetica',fontSize=sz,leading=sz*1.32,textColor=colors.HexColor(color)))
flow=[]
for num,pg in enumerate(pages):
 if num:flow.append(PageBreak())
 for k,d in pg:
  if k=='t':
   hd,rs,ws=d;t=Table([[para(x,8,j==0,'#ffffff' if j==0 else '#163444') for x in r] for j,r in enumerate([hd]+rs)],colWidths=ws,repeatRows=1,hAlign='LEFT')
   t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#155469')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.HexColor('#edf3f3'),colors.white]),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),4),('RIGHTPADDING',(0,0),(-1,-1),4)]));flow.append(t)
  else:flow.append(para(d,19 if k=='h' else 10,k=='h'))
  flow.append(Spacer(1,7))
def foot(c,d):
 c.setFont('Helvetica',8);c.drawString(42,22,'CALORIE AND MACRO MEAL FINDER     /     TEAM PLANNING DRAFT');c.drawRightString(570,22,str(d.page))
SimpleDocTemplate(str(P/'Assignment_8_Plan.pdf'),pagesize=letter,topMargin=38,bottomMargin=38,leftMargin=40,rightMargin=40).build(flow,onFirstPage=foot,onLaterPages=foot)
